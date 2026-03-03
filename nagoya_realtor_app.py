#!/usr/bin/env python3
"""
名古屋房产房源 - Streamlit 网页应用
部署: streamlit run app.py
"""

import streamlit as st
import pandas as pd
import requests
from datetime import datetime
import time

# 页面配置
st.set_page_config(
    page_title="名古屋房产",
    page_icon="🏠",
    layout="wide"
)

# 标题
st.title("🏠 名古屋房产房源")
st.markdown("---")

# 侧边栏
st.sidebar.title("选项")

# 刷新按钮
if st.sidebar.button("🔄 刷新数据"):
    st.rerun()

st.sidebar.markdown(f"**更新时间:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# 加载数据
@st.cache_data(ttl=0)  # 不缓存
def load_data():
    """从CSV加载房源数据"""
    url = "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/nagoya_properties.csv"
    
    try:
        # 添加时间戳避免缓存
        response = requests.get(url, params={'t': time.time()})
        from io import StringIO
        df = pd.read_csv(StringIO(response.text))
        return df
    except Exception as e:
        st.sidebar.error(f"加载失败: {e}")
        return None

# 加载数据
df = load_data()

# 语言选项
language = st.sidebar.selectbox(
    "选择语言",
    ["中文", "日语", "越南语", "尼泊尔语"]
)

# 房源类型
if df is not None:
    if 'type' in df.columns:
        property_types = df['type'].unique()
        selected_types = st.sidebar.multiselect(
            "房源类型",
            property_types,
            default=property_types
        )
        
        if selected_types:
            df = df[df['type'].isin(selected_types)]

# 显示数据
if df is not None and len(df) > 0:
    title_col = {
        "中文": "title_zh",
        "日语": "title_ja", 
        "越南语": "title_vi",
        "尼泊尔语": "title_ne"
    }.get(language, "title_zh")
    
    st.sidebar.markdown(f"**房源数量:** {len(df)}")
    
    # 标签页
    tab1, tab2 = st.tabs(["🏠 房源列表", "📊 统计"])
    
    with tab1:
        st.header(f"房源列表 ({len(df)}条)")
        
        # 搜索
        search = st.text_input("🔍 搜索房源")
        
        if search:
            df = df[df[title_col].str.contains(search, na=False, case=False)]
        
        # 显示
        for idx, row in df.head(100).iterrows():  # 限制显示100条避免卡顿
            with st.container():
                col1, col2 = st.columns([1, 2])
                
                with col1:
                    # 示例公寓图片
                    sample_imgs = [
                        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", 
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
                        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400",
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
                    ]
                    import random
                    img_url = random.choice(sample_imgs)
                    try:
                        st.image(img_url, width=250)
                    except:
                        st.write("🏠")
                
                with col2:
                    title = row.get(title_col, row.get('title_ja', ''))
                    st.subheader(title)
                    
                    info_cols = st.columns(3)
                    with info_cols[0]:
                        st.metric("价格", row.get('price', 'N/A'))
                    with info_cols[1]:
                        st.metric("面积", row.get('area', 'N/A'))
                    with info_cols[2]:
                        st.metric("户型", row.get('layout', 'N/A'))
                    
                    if 'address' in row and pd.notna(row['address']):
                        st.write(f"📍 {row['address']}")
                    
                    st.caption(f"来源: {row.get('source', 'N/A')}")
                
                st.divider()
        
        if len(df) > 100:
            st.info(f"显示前100条，共{len(df)}条")
        
        csv = df.to_csv(index=False, encoding='utf-8-sig')
        st.download_button(
            label="📥 下载 CSV",
            data=csv,
            file_name="nagoya_properties.csv",
            mime="text/csv"
        )
    
    with tab2:
        st.header("统计信息")
        
        if 'type' in df.columns:
            st.write("#### 房源类型")
            type_counts = df['type'].value_counts()
            st.bar_chart(type_counts)
        
        if 'source' in df.columns:
            st.write("#### 来源统计")
            source_counts = df['source'].value_counts()
            st.bar_chart(source_counts)
        
        st.markdown(f"**总计: {len(df)} 条房源**")
        
else:
    st.warning("暂无数据")

# 来源
if df is not None and 'source' in df.columns:
    st.sidebar.markdown("---")
    st.sidebar.markdown("**数据来源:**")
    for source in df['source'].unique():
        st.sidebar.markdown(f"- {source}")
