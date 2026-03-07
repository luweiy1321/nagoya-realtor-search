#!/usr/bin/env python3
"""
轻量级图片元素动画脚本
支持：花朵、水流、云朵、萤火虫等

使用方法：
python3 animate_simple.py --input image.jpg --element flower --duration 2 --output flower.gif
"""

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance
import argparse
import os
import math
from pathlib import Path

def lissajous_curve(t, a, b, delta_x=0, delta_y=0):
    """Lissajous曲线生成平滑轨迹"""
    x = math.sin(a * t + delta_x)
    y = math.sin(b * t + delta_y)
    return x, y

class SimpleAnimator:
    def __init__(self, bg_path, element_type, duration_hours=2, fps=10, output_path='output.gif'):
        self.bg_path = Path(bg_path)
        self.element_type = element_type.lower()
        self.duration_hours = duration_hours
        self.fps = fps
        self.output_path = Path(output_path)
        self.total_frames = int(duration_hours * 3600 * fps)
        print(f"📊 参数：{duration_hours}小时 × {fps}fps = {self.total_frames}帧")

        # 加载背景
        self.bg = Image.open(bg_path).convert('RGBA')
        self.width, self.height = self.bg.size

    def generate_flower_positions(self, frame_num, time_hours):
        """生成花朵位置（摇曳效果）"""
        num_flowers = 20
        positions = []

        for i in range(num_flowers):
            # 不同种子保证不重复
            seed = (i * 73 + frame_num * 0.01) % 10000
            t = time_hours * 2 + seed * 0.1

            # Lissajous曲线生成平滑摇曳
            a = (i % 3) + 1
            b = (i % 4) + 1

            # 归一化到0-1
            x_norm, y_norm = lissajous_curve(t, a, b)
            x = 0.1 + (i % 10) * 0.08 + x_norm * 0.03
            y = 0.3 + (i % 5) * 0.1 + y_norm * 0.03

            positions.append({'x': x, 'y': y, 'size': 15 + np.sin(t + i) * 3})

        return positions

    def generate_water_waves(self, frame_num, time_hours):
        """生成水流波纹"""
        waves = []
        num_layers = 6

        for layer in range(num_layers):
            seed = (layer * 67 + frame_num * 0.008) % 10000
            t = time_hours * 0.5 + seed * 0.01

            # 波纹点
            points = []
            for i in range(60):
                x = i / 60
                offset = np.sin(2 * np.pi * (2 + layer) * x + t + seed * 3) * 0.02
                y = 0.4 + layer * 0.08 + offset

                points.append((x, y))
            waves.append(points)

        return waves

    def generate_leaf_positions(self, frame_num, time_hours):
        """生成树叶飘落"""
        num_leaves = 30
        positions = []

        for i in range(num_leaves):
            seed = (i * 101 + frame_num * 0.012) % 10000
            t = time_hours * 0.3 + seed * 0.02

            # 飘落轨迹
            start_x = (i * 47 % 100) / 100
            start_y = 0.8

            # 用正弦波模拟飘落
            x = start_x + np.sin(t + seed) * 0.1
            y = start_y - (t * 0.5 % 1) * 0.6

            # 旋转
            rotation = np.sin(t * 2 + seed * 5) * 30

            # 循环：超出画面后从顶部重新出现
            if y < -0.1:
                y = 0.9
                start_x = (i * 53 + frame_num) % 100 / 100

            positions.append({'x': x, 'y': y, 'rotation': rotation})

        return positions

    def generate_firefly_positions(self, frame_num, time_hours):
        """生成萤火虫位置"""
        num_fireflies = 25
        positions = []

        for i in range(num_fireflies):
            seed = (i * 137 + frame_num * 0.01) % 10000
            t = time_hours * 0.5 + seed * 0.01

            # Lissajous曲线
            a = (i % 3) + 1
            b = (i % 4) + 1
            x_norm, y_norm = lissajous_curve(t, a, b)

            x = 0.15 + (i % 10) * 0.08 + x_norm * 0.15
            y = 0.3 + (i % 6) * 0.1 + y_norm * 0.15

            # 发光强度
            glow = 0.6 + 0.4 * np.sin(t * 3 + seed * 2)

            positions.append({'x': x, 'y': y, 'glow': glow, 'size': 8})

        return positions

    def draw_frame(self, frame_num, time_hours):
        """绘制单帧"""
        # 复制背景
        frame = self.bg.copy()

        # 如果是纱幔效果，添加透明度变化
        if self.element_type in ['curtain', '纱幔']:
            alpha = 150 + 100 * np.sin(time_hours * 2 + frame_num * 0.001)
            # 这里简化处理，只返回背景
            return frame

        # 根据类型绘制元素
        if self.element_type == 'flower' or self.element_type == '花朵':
            positions = self.generate_flower_positions(frame_num, time_hours)
            draw = ImageDraw.Draw(frame)
            for pos in positions:
                x_px = int(pos['x'] * self.width)
                y_px = int(pos['y'] * self.height)
                size = int(pos['size'])
                # 简单画花（用椭圆代替）
                draw.ellipse([x_px - size, y_px - size, x_px + size, y_px + size],
                           fill='pink')

        elif self.element_type == 'water' or self.element_type == '水流':
            waves = self.generate_water_waves(frame_num, time_hours)
            draw = ImageDraw.Draw(frame)
            for wave_points in waves:
                # 画波纹线
                points_2d = [(int(p[0] * self.width), int(p[1] * self.height)) for p in wave_points]
                if len(points_2d) > 1:
                    draw.line(points_2d, fill='lightblue', width=1)

        elif self.element_type == 'leaf' or self.element_type == '树叶':
            positions = self.generate_leaf_positions(frame_num, time_hours)
            draw = ImageDraw.Draw(frame)
            for pos in positions:
                x_px = int(pos['x'] * self.width)
                y_px = int(pos['y'] * self.height)
                # 简单画叶子（用小椭圆）
                draw.ellipse([x_px - 4, y_px - 2, x_px + 4, y_px + 2],
                           fill='green', outline='darkgreen')

        elif self.element_type == 'firefly' or self.element_type == '萤火虫':
            positions = self.generate_firefly_positions(frame_num, time_hours)
            # 先画光晕
            for pos in positions:
                x_px = int(pos['x'] * self.width)
                y_px = int(pos['y'] * self.height)
                glow_size = int(pos['size'] * 3)
                glow_alpha = int(pos['glow'] * 80)

                # 绘制光晕（需要半透明）
                glow = Image.new('RGBA', (glow_size*2, glow_size*2), (255, 255, 0, 0))
                glow_draw = ImageDraw.Draw(glow)
                glow_draw.ellipse([0, 0, glow_size*2, glow_size*2],
                                 fill=(255, 255, 0, glow_alpha))
                glow = glow.rotate(pos.get('rotation', 0))

                # 粘贴到帧
                frame.paste(glow, (x_px - glow_size, y_px - glow_size), glow)

            # 再画萤火虫本体
            for pos in positions:
                x_px = int(pos['x'] * self.width)
                y_px = int(pos['y'] * self.height)
                size = int(pos['size'])
                draw.ellipse([x_px - size, y_px - size, x_px + size, y_px + size],
                           fill='yellow', outline='orange', width=1)

        # 添加时间标签（每60帧一次，即每分钟）
        if frame_num % (self.fps * 60) == 0:
            draw = ImageDraw.Draw(frame)
            minutes = int(frame_num / self.fps / 60)
            time_text = f"{minutes} min"
            # 简单时间标签
            draw.text((10, 10), time_text, fill='white')

        return frame

    def animate(self):
        """生成动画"""
        print(f"🎬 开始生成: {self.element_type}")
        print(f"📁 输出: {self.output_path}")

        # 创建输出目录
        self.output_path.parent.mkdir(parents=True, exist_ok=True)

        # 准备帧
        frames = []
        time_hours_step = 1 / self.fps / 3600  # 每帧对应的小时数

        for frame_num in range(0, self.total_frames, 1):
            time_hours = frame_num * time_hours_step

            # 进度
            if frame_num % (self.total_frames // 20) == 0:
                progress = (frame_num / self.total_frames) * 100
                print(f"⏳ {progress:.1f}% ({frame_num}/{self.total_frames})")

            # 绘制帧
            frame = self.draw_frame(frame_num, time_hours)
            frames.append(frame)

        # 保存GIF
        print(f"💾 正在保存...")

        # 调整大小以减少文件
        frames_resized = [f.resize((800, 600)) for f in frames]

        # 保存
        frames_resized[0].save(
            self.output_path,
            save_all=True,
            append_images=frames_resized[1:],
            duration=100,  # ms per frame at 10fps
            loop=0,
            optimize=True
        )

        print(f"✅ 完成: {self.output_path}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', '-i', required=True, help='背景图片路径')
    parser.add_argument('--element', '-e', required=True,
                       help='元素类型: flower(花朵), water(水流), leaf(树叶), firefly(萤火虫), curtain(纱幔)')
    parser.add_argument('--duration', '-d', type=float, default=2, help='时长（小时），默认2')
    parser.add_argument('--fps', '-f', type=int, default=10, help='帧率，默认10')
    parser.add_argument('--output', '-o', default='output.gif', help='输出路径')
    parser.add_argument('--mp4', action='store_true', help='输出为MP4格式（需要额外步骤）')

    args = parser.parse_args()

    output_path = Path(args.output)
    if args.mp4 and output_path.suffix not in ['.mp4', '.mov']:
        output_path = output_path.with_suffix('.mp4')

    try:
        animator = SimpleAnimator(
            bg_path=args.input,
            element_type=args.element,
            duration_hours=args.duration,
            fps=args.fps,
            output_path=output_path
        )
        animator.animate()

    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
