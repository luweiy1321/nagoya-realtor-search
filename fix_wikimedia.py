#!/usr/bin/env python3
"""
用 Wikimedia Commons 真实现场照片
"""

import csv
import random

# 真实的日本公寓/建筑照片（来自Wikimedia Commons）
WIKIMEDIA = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/A_Japanese_apartment_-_Flickr_-_odako1.jpg/400px-A_Japanese_apartment_-_Flickr_-_odako1.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Apartment_building_in_unidentified_location_in_Japan_-_画像_022.jpg/400px-Apartment_building_in_unidentified_location_in_Japan_-_画像_022.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Apartment_umibe_P5262031.jpg/320px-Apartment_umibe_P5262031.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Balconies_of_a_Sapporo_apartment_building.jpg/400px-Balconies_of_a_Sapporo_apartment_building.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Colors_of_Midnight_Apartment_%282615836279%29.jpg/400px-Colors_of_Midnight_Apartment_%282615836279%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Condominium_in_maintenance.jpg/400px-Condominium_in_maintenance.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Door_face_%28124434824%29.jpg/320px-Door_face_%28124434824%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Maison_Boulogne_Ichinoki.jpg/400px-Maison_Boulogne_Ichinoki.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Mutsumi-so_2019-07-18.jpg/400px-Mutsumi-so_2019-07-18.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Nagaya_Tower_Kagoshima.jpg/400px-Nagaya_Tower_Kagoshima.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Polestar_Kamisuwa-ekimae-terrace.jpg/400px-Polestar_Kamisuwa-ekimae-terrace.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Tokyo_Apartment_Block_%28227773659%29.jpeg/400px-Tokyo_Apartment_Block_%28227773659%29.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/-_panoramio_%284066%29.jpg/400px-_-panoramio_%284066%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/1_Chome_Hikoshima_Enourach%C5%8D%2C_Shimonoseki-shi%2C_Yamaguchi-ken_750-0075%2C_Japan_-_panoramio.jpg/400px-1_Chome_Hikoshima_Enourach%C5%8D%2C_Shimonoseki-shi%2C_Yamaguchi-ken_750-0075%2C_Japan_-_panoramio.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/At_Kyoto_2024_154.jpg/400px-At_Kyoto_2024_154.jpg",
]

rows = []
with open('nagoya_properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条")

for row in rows:
    row['image_url'] = random.choice(WIKIMEDIA)

with open('nagoya_properties_wiki.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("完成！")
