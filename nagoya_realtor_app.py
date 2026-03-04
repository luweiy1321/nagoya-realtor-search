#!/usr/bin/env python3
"""
名古屋房产房源 - Streamlit 网页应用
"""

import streamlit as st
import pandas as pd
import requests
from datetime import datetime
import time
import random

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
st.sidebar.title("🔍 筛选条件")

# 刷新按钮
if st.sidebar.button("🔄 刷新数据"):
    st.rerun()

st.sidebar.markdown(f"**更新时间:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# 加载数据
@st.cache_data(ttl=0)
def load_data():
    url = "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/nagoya_properties.csv"
    try:
        response = requests.get(url, params={'t': time.time()})
        from io import StringIO
        df = pd.read_csv(StringIO(response.text))
        return df
    except Exception as e:
        return None

df = load_data()

if df is not None:
    # ====== 筛选条件 ======
    
    # 语言选择
    language = st.sidebar.selectbox(
        "🌐 选择语言",
        ["中文", "日语", "越南语", "尼泊尔语"]
    )
    
    st.sidebar.markdown("---")
    
    # 房源类型筛选
    if 'type' in df.columns:
        property_types = df['type'].unique()
        selected_types = st.sidebar.multiselect(
            "🏠 房源类型",
            property_types,
            default=property_types
        )
        if selected_types:
            df = df[df['type'].isin(selected_types)]
    
    st.sidebar.markdown("---")
    
    # 价格筛选
    if 'price' in df.columns:
        # 提取数字价格
        def extract_price(p):
            if pd.isna(p):
                return 0
            import re
            nums = re.findall(r'[\d.]+', str(p))
            return float(nums[0]) * 10000 if nums else 0
        
        df['price_num'] = df['price'].apply(extract_price)
        
        price_range = st.sidebar.slider(
            "💰 价格范围 (万円/月)",
            min_value=0,
            max_value=50,
            value=(0, 50),
            step=1
        )
        df = df[(df['price_num'] >= price_range[0]) & (df['price_num'] <= price_range[1])]
    
    st.sidebar.markdown("---")
    
    # 面积筛选
    if 'area' in df.columns:
        def extract_area(a):
            if pd.isna(a):
                return 0
            import re
            nums = re.findall(r'[\d.]+', str(a))
            return float(nums[0]) if nums else 0
        
        df['area_num'] = df['area'].apply(extract_area)
        
        area_range = st.sidebar.slider(
            "📐 面积范围 (m²)",
            min_value=0,
            max_value=150,
            value=(0, 150),
            step=5
        )
        df = df[(df['area_num'] >= area_range[0]) & (df['area_num'] <= area_range[1])]
    
    st.sidebar.markdown("---")
    
    # 户型筛选
    if 'layout' in df.columns:
        layouts = df['layout'].unique()
        selected_layouts = st.sidebar.multiselect(
            "🗺️ 户型",
            sorted(layouts),
            default=layouts
        )
        if selected_layouts:
            df = df[df['layout'].isin(selected_layouts)]
    
    st.sidebar.markdown("---")
    st.sidebar.markdown(f"**📊 筛选结果: {len(df)} 条**")
    
    # ====== 显示内容 ======
    
    if len(df) > 0:
        title_col = {
            "中文": "title_zh",
            "日语": "title_ja", 
            "越南语": "title_vi",
            "尼泊尔语": "title_ne"
        }.get(language, "title_zh")
        
        # 标签页
        tab1, tab2 = st.tabs(["🏠 房源列表", "📊 统计"])
        
        with tab1:
            st.header(f"房源列表 ({len(df)}条)")
            
            # 搜索
            search = st.text_input("🔍 搜索房源")
            
            if search:
                df = df[df[title_col].str.contains(search, na=False, case=False)]
            
            # 显示
            for idx, row in df.head(50).iterrows():
                with st.container():
                    col1, col2 = st.columns([1, 2])
                    
                    with col1:
                        # 使用真实SUUMO截图
                        img_url = "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/nagoya_all.png"
                        try:
                            st.image(img_url, width=280)
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
            
            if len(df) > 50:
                st.info(f"显示前50条，共{len(df)}条")
            
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
        st.warning("没有符合条件的房源")
    
else:
    st.error("加载数据失败")

# 来源
if df is not None and 'source' in df.columns:
    st.sidebar.markdown("---")
    st.sidebar.markdown("**数据来源:**")
    for source in df['source'].unique():
        st.sidebar.markdown(f"- {source}")
