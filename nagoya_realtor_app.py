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
import re

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
    # 从GitHub加载详细数据
    url = "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/nagoya_properties_detailed.csv"
    try:
        response = requests.get(url, params={'t': time.time()})
        from io import StringIO
        df = pd.read_csv(StringIO(response.text))
        return df
    except Exception as e:
        return None

df = load_data()

if df is not None:
    # 标准化列名
    column_mapping = {
        'ID': 'id',
        '来源': 'source',
        '房源ID': 'property_id',
        '类型': 'type',
        '标题': 'title',
        '价格(日元)': 'price_raw',
        '价格显示': 'price',
        '地址': 'address',
        '面积(㎡)': 'area',
        '房型': 'layout',
        '楼层': 'floor',
        '建筑类型': 'building_type',
        '建造年份': 'construction_year',
        '总楼层': 'total_floors',
        '最近车站': 'station',
        '步行分钟': 'walking_minutes',
        '联系人': 'contact',
        '电话': 'phone',
        '详情链接': 'detail_url',
        '爬取时间': 'scraped_at'
    }
    df = df.rename(columns=column_mapping)
    
    # ====== 筛选条件 ======
    st.sidebar.title("🔍 筛选条件")
    
    # 语言选择
    language = st.sidebar.selectbox(
        "🌐 选择语言",
        ["中文", "日语"]
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
        def extract_price(p):
            if pd.isna(p):
                return 0
            nums = re.findall(r'[\d.]+', str(p))
            return float(nums[0]) * 10000 if nums else 0
        
        df['price_num'] = df['price'].apply(extract_price)
        
        price_range = st.sidebar.slider(
            "💰 价格范围 (万円/月)",
            min_value=0,
            max_value=200,
            value=(0, 200),
            step=5
        )
        df = df[(df['price_num'] >= price_range[0]) & (df['price_num'] <= price_range[1])]
    
    st.sidebar.markdown("---")
    
    # 面积筛选
    if 'area' in df.columns:
        df['area_num'] = pd.to_numeric(df['area'], errors='coerce').fillna(0)
        
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
        layouts = df['layout'].dropna().unique()
        selected_layouts = st.sidebar.multiselect(
            "🗺️ 户型",
            sorted([str(l) for l in layouts]),
            default=[str(l) for l in layouts]
        )
        if selected_layouts:
            df = df[df['layout'].astype(str).isin(selected_layouts)]
    
    st.sidebar.markdown("---")
    st.sidebar.markdown(f"**📊 筛选结果: {len(df)} 条**")
    
    # ====== 显示内容 ======
    
    if len(df) > 0:
        # 标签页
        tab1, tab2 = st.tabs(["🏠 房源列表", "📊 统计"])
        
        with tab1:
            st.header(f"房源列表 ({len(df)}条)")
            
            # 搜索
            search = st.text_input("🔍 搜索房源")
            
            if search and 'title' in df.columns:
                df = df[df['title'].str.contains(search, na=False, case=False)]
            
            # 显示
            for idx, row in df.head(50).iterrows():
                with st.container():
                    # 图片
                    col1, col2 = st.columns([1, 2])
                    
                    with col1:
                        img_url = "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/nagoya_all.png"
                        try:
                            st.image(img_url, width=280)
                        except:
                            st.write("🏠")
                    
                    with col2:
                        # 标题
                        title = row.get('title', '未命名')
                        st.subheader(title)
                        
                        # 基本信息
                        info_cols = st.columns(3)
                        with info_cols[0]:
                            st.metric("价格", row.get('price', 'N/A'))
                        with info_cols[1]:
                            st.metric("面积", f"{row.get('area', 'N/A')}m²")
                        with info_cols[2]:
                            st.metric("户型", row.get('layout', 'N/A'))
                        
                        # 详细信息
                        if 'address' in row and pd.notna(row.get('address')):
                            st.write(f"📍 **地址:** {row['address']}")
                        
                        if 'station' in row and pd.notna(row.get('station')):
                            walk = row.get('walking_minutes', '')
                            st.write(f"🚃 **车站:** {row['station']} {walk}分钟" if walk else f"🚃 **车站:** {row['station']}")
                        
                        # 联系信息
                        st.markdown("---")
                        contact_cols = st.columns(2)
                        with contact_cols[0]:
                            if 'contact' in row and pd.notna(row.get('contact')):
                                st.write(f"👤 **联系人:** {row['contact']}")
                        with contact_cols[1]:
                            if 'phone' in row and pd.notna(row.get('phone')):
                                st.write(f"📞 **电话:** {row['phone']}")
                        
                        # 详情链接
                        if 'detail_url' in row and pd.notna(row.get('detail_url')):
                            st.markdown(f"[查看详情 →]({row['detail_url']})")
                        
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
