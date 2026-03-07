#!/usr/bin/env python3
"""
轻量级图片元素动画脚本 - 智能循环版本
原理：生成1分钟帧（360帧），然后循环播放120次 = 2小时

使用方法：
python3 animate_smart.py --input image.jpg --element flower --output flower.gif
"""

from PIL import Image, ImageDraw, ImageEnhance
import argparse
import math
from pathlib import Path

def lissajous_curve(t, a, b, delta_x=0, delta_y=0):
    """Lissajous曲线生成平滑轨迹"""
    x = math.sin(a * t + delta_x)
    y = math.sin(b * t + delta_y)
    return x, y

class SmartAnimator:
    def __init__(self, bg_path, element_type, fps=10, output_path='output.gif'):
        self.bg_path = Path(bg_path)
        self.element_type = element_type.lower()
        self.fps = fps
        self.output_path = Path(output_path)

        # 1分钟 = 3600秒 / fps = 帧数
        self.base_frames = int(3600 / fps)
        # 2小时 = 120次循环
        self.loops = 120
        print(f"📊 配置：{fps}fps × 60秒 = {self.base_frames}帧 × {self.loops}次循环 = 2小时")

        # 加载背景
        self.bg = Image.open(bg_path).convert('RGBA')
        self.width, self.height = self.bg.size

    def generate_flower_positions(self, frame_num, time_seconds):
        """生成花朵位置"""
        num_flowers = 15
        positions = []

        for i in range(num_flowers):
            seed = (i * 73 + frame_num * 0.05) % 10000
            t = time_seconds + seed * 0.05

            a = (i % 3) + 1
            b = (i % 4) + 1
            x_norm, y_norm = lissajous_curve(t * 0.1, a, b)

            x = 0.1 + (i % 10) * 0.08 + x_norm * 0.03
            y = 0.4 + (i % 5) * 0.1 + y_norm * 0.03

            positions.append({'x': x, 'y': y, 'size': 12 + math.sin(t + i) * 3})

        return positions

    def generate_water_waves(self, frame_num, time_seconds):
        """生成水流波纹"""
        waves = []
        num_layers = 4

        for layer in range(num_layers):
            seed = (layer * 67 + frame_num * 0.06) % 10000
            t = time_seconds * 0.3 + seed * 0.02

            points = []
            for i in range(40):
                x = i / 40
                offset = math.sin(2 * math.pi * (2 + layer) * x + t + seed * 2) * 0.02
                y = 0.45 + layer * 0.1 + offset

                points.append((x, y))
            waves.append(points)

        return waves

    def generate_firefly_positions(self, frame_num, time_seconds):
        """生成萤火虫位置"""
        num_fireflies = 20
        positions = []

        for i in range(num_fireflies):
            seed = (i * 137 + frame_num * 0.04) % 10000
            t = time_seconds * 0.2 + seed * 0.02

            a = (i % 3) + 1
            b = (i % 4) + 1
            x_norm, y_norm = lissajous_curve(t * 0.1, a, b)

            x = 0.15 + (i % 10) * 0.08 + x_norm * 0.15
            y = 0.3 + (i % 6) * 0.1 + y_norm * 0.15

            glow = 0.5 + 0.5 * math.sin(t * 2 + seed * 2)

            positions.append({'x': x, 'y': y, 'glow': glow, 'size': 6})

        return positions

    def draw_frame(self, frame_num, time_seconds):
        """绘制单帧"""
        frame = self.bg.copy()
        draw = ImageDraw.Draw(frame)

        # 根据类型绘制
        if self.element_type == 'flower' or self.element_type == '花朵':
            positions = self.generate_flower_positions(frame_num, time_seconds)
            for pos in positions:
                x_px = int(pos['x'] * self.width)
                y_px = int(pos['y'] * self.height)
                size = int(pos['size'])
                # 画花瓣（用椭圆）
                draw.ellipse([x_px - size, y_px - size, x_px + size, y_px + size],
                           fill='pink')

        elif self.element_type == 'water' or self.element_type == '水流':
            waves = self.generate_water_waves(frame_num, time_seconds)
            for wave_points in waves:
                points_2d = [(int(p[0] * self.width), int(p[1] * self.height)) for p in wave_points]
                if len(points_2d) > 1:
                    draw.line(points_2d, fill='lightblue', width=1)

        elif self.element_type == 'firefly' or self.element_type == '萤火虫':
            positions = self.generate_firefly_positions(frame_num, time_seconds)
            for pos in positions:
                x_px = int(pos['x'] * self.width)
                y_px = int(pos['y'] * self.height)
                glow_size = int(pos['size'] * 2)
                glow_alpha = int(pos['glow'] * 100)

                # 光晕
                glow = Image.new('RGBA', (glow_size*2, glow_size*2), (255, 255, 0, 0))
                glow_draw = ImageDraw.Draw(glow)
                glow_draw.ellipse([0, 0, glow_size*2, glow_size*2],
                                 fill=(255, 255, 0, glow_alpha))

                # 粘贴到帧
                frame.paste(glow, (x_px - glow_size, y_px - glow_size), glow)

            # 萤火虫本体
            for pos in positions:
                x_px = int(pos['x'] * self.width)
                y_px = int(pos['y'] * self.height)
                size = int(pos['size'])
                draw.ellipse([x_px - size, y_px - size, x_px + size, y_px + size],
                           fill='yellow', outline='orange', width=1)

        # 时间标签
        if frame_num % (self.base_frames // 10) == 0:  # 每6秒一次
            seconds = frame_num / self.fps
            draw.text((10, 10), f"{seconds:.0f}s", fill='white')

        return frame

    def animate(self):
        """生成动画"""
        print(f"🎬 开始生成: {self.element_type}")
        print(f"📁 输出: {self.output_path}")

        self.output_path.parent.mkdir(parents=True, exist_ok=True)

        # 生成基础帧（60秒）
        frames = []
        for frame_num in range(self.base_frames):
            if frame_num % (self.base_frames // 10) == 0:
                progress = (frame_num / self.base_frames) * 100
                print(f"⏳ 基础帧 {progress:.1f}% ({frame_num}/{self.base_frames})")

            time_seconds = frame_num / self.fps
            frame = self.draw_frame(frame_num, time_seconds)
            frames.append(frame)

        # 保存为GIF，设置循环次数
        print(f"💾 保存GIF（设置{self.loops}次循环=2小时）...")

        frames_resized = [f.resize((640, 480)) for f in frames]

        frames_resized[0].save(
            self.output_path,
            save_all=True,
            append_images=frames_resized[1:],
            duration=int(1000 / self.fps),  # ms per frame
            loop=self.loops,  # 循环次数
            optimize=True
        )

        print(f"✅ 完成: {self.output_path}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', '-i', required=True, help='背景图片路径')
    parser.add_argument('--element', '-e', required=True,
                       help='元素类型: flower(花朵), water(水流), firefly(萤火虫)')
    parser.add_argument('--fps', '-f', type=int, default=10, help='帧率，默认10')
    parser.add_argument('--output', '-o', default='output.gif', help='输出路径')

    args = parser.parse_args()

    output_path = Path(args.output)

    try:
        animator = SmartAnimator(
            bg_path=args.input,
            element_type=args.element,
            fps=args.fps,
            output_path=output_path
        )
        animator.animate()

    except Exception as e:
        print(f"❌ 错误: {e}")

if __name__ == '__main__':
    main()
