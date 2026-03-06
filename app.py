import streamlit as st
import pandas as pd
from pathlib import Path

# 设置页面
st.set_page_config(
    page_title="名古屋租房信息",
    page_icon="🏠",
    layout="wide"
)

# 标题
st.title("🏠 名古屋租房信息查询")
st.markdown("---")

# 加载数据
@st.cache_data
def load_data():
    try:
        # 从GitHub加载
        url = "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-search/main/nagoya_all_properties.csv"
        df = pd.read_csv(url)
        return df
    except:
        return None

df = load_data()

if df is not None:
    # 筛选功能
    st.sidebar.header("🔍 筛选条件")
    
    # 来源筛选
    sources = df["来源"].unique().tolist()
    selected_sources = st.sidebar.multiselect("来源", sources, default=sources)
    
    # 价格筛选
    prices = df["房租"].dropna()
    if len(prices) > 0:
        min_price = int(prices.min())
        max_price = int(prices.max())
        price_range = st.sidebar.slider("房租 (日元/月)", min_price, max_price, (min_price, max_price))
    
    # 筛选数据
    filtered_df = df[df["来源"].isin(selected_sources)]
    if len(prices) > 0:
        filtered_df = filtered_df[
            (filtered_df["房租"] >= price_range[0]) & 
            (filtered_df["房租"] <= price_range[1])
        ]
    
    # 显示统计
    st.sidebar.markdown("---")
    st.sidebar.markdown(f"**共 {len(filtered_df)} 条房源**")
    
    # 显示数据
    st.dataframe(
        filtered_df,
        use_container_width=True,
        hide_index=True
    )
    
    # 详情展示
    st.markdown("---")
    st.subheader("📋 房源详情")
    
    for idx, row in filtered_df.head(10).iterrows():
        with st.expander(f"{row['名称']} - {row['房租']}日元/月"):
            col1, col2 = st.columns(2)
            with col1:
                st.markdown(f"**地址:** {row['地址']}")
                st.markdown(f"**交通:** {row['交通']}")
                st.markdown(f"**筑龄:** {row['筑龄']}")
            with col2:
                st.markdown(f"**房型:** {row['房型']}")
                st.markdown(f"**面积:** {row['面积']}")
                st.markdown(f"**楼层:** {row['楼层']}")
                st.markdown(f"**管理费:** {row['管理费']}")
                st.markdown(f"**押金:** {row['押金']}")
                st.markdown(f"**礼金:** {row['礼金']}")
                st.markdown(f"**来源:** {row['来源']}")

else:
    st.error("无法加载数据，请检查网络连接")

# 页脚
st.markdown("---")
st.markdown("📊 数据来源: SUUMO, CHINTAI, Yahoo!不动产")
