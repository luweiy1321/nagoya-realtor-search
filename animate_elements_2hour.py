#!/usr/bin/env python3
"""
图片元素动画脚本 - 2小时不重复运动轨迹生成
支持：萤火虫、水流、云朵、月亮、花草等元素

使用方法：
python animate_elements_2hour.py --input background.png --element firefly --duration 2 --output firefly_2hour.gif
"""

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from PIL import Image, ImageDraw, ImageFont
import argparse
import os
import sys
from pathlib import Path

# 颜色配置
COLORS = {
    'firefly': {'color': '#FFFF00', 'size': 15, 'glow': '#FFFF66'},
    'water': {'color': '#87CEEB', 'alpha': 0.3, 'wave_color': '#4682B4'},
    'cloud': {'color': '#FFFFFF', 'alpha': 0.7, 'shadow': '#CCCCCC'},
    'moon': {'color': '#F5F5DC', 'glow': '#FFFAF0'},
    'flower': {'color': '#FF69B4', 'stem': '#228B22'}
}

class ElementAnimator:
    """元素动画生成器"""

    def __init__(self, bg_path, element_type, duration_hours=2, fps=10, output_path='output.gif'):
        self.bg_path = Path(bg_path)
        self.element_type = element_type.lower()
        self.duration_hours = duration_hours
        self.fps = fps
        self.output_path = Path(output_path)

        # 计算总帧数
        self.total_frames = int(duration_hours * 3600 * fps)
        print(f"📊 生成参数：{duration_hours}小时 × {fps}fps = {self.total_frames}帧")

        # 加载背景图
        if not self.bg_path.exists():
            raise FileNotFoundError(f"背景图不存在: {bg_path}")
        self.bg_image = Image.open(self.bg_path)
        self.bg_width, self.bg_height = self.bg_image.size

    def perlin_like_noise(self, x, y, time_offset, scale=0.1):
        """类Perlin噪声生成平滑随机运动"""
        # 简化版，实际可用noise库
        noise = (np.sin(x * scale + time_offset) *
                 np.cos(y * scale + time_offset * 0.7) +
                 np.sin((x + y) * scale * 0.5 + time_offset * 1.3))
        return noise

    def generate_firefly(self, frame_num, time_seconds):
        """生成萤火虫位置"""
        # 多个萤火虫，每个不同轨迹
        num_fireflies = 15
        positions = []

        for i in range(num_fireflies):
            # 用不同种子保证轨迹不重复
            seed = (i * 137 + frame_num * 0.01) % 10000

            # Lissajous曲线生成平滑不重复轨迹
            t = time_seconds * 0.1 + seed * 0.01
            a = (i % 3) + 1  # 不同的曲线参数
            b = (i % 4) + 1

            x = (np.sin(a * t + seed) * 0.4 + np.cos(b * t * 0.5 + seed) * 0.3) * 0.5 + 0.5
            y = (np.sin(b * t + seed * 0.5) * 0.3 + np.cos(a * t * 0.7 + seed) * 0.4) * 0.5 + 0.5

            # 限制在画面内
            x = max(0.05, min(0.95, x))
            y = max(0.05, min(0.95, y))

            positions.append((x, y))

        return positions

    def generate_water(self, frame_num, time_seconds):
        """生成水流波纹"""
        # 多层水波
        waves = []
        num_layers = 5

        for layer in range(num_layers):
            seed = (layer * 73 + frame_num * 0.003) % 10000
            t = time_seconds * 0.05 + seed * 0.005

            # 波动参数
            amplitude = 0.02 + layer * 0.01
            frequency = 1 + layer * 0.5
            phase = seed * 2 * np.pi

            # 生成波纹线
            points = []
            for i in range(100):
                x = i / 100
                y_offset = amplitude * np.sin(2 * np.pi * frequency * x + t + phase)
                points.append((x, 0.5 + y_offset + layer * 0.1))

            waves.append({'points': points, 'layer': layer})

        return waves

    def generate_cloud(self, frame_num, time_seconds):
        """生成云朵移动"""
        num_clouds = 8
        clouds = []

        for i in range(num_clouds):
            seed = (i * 101 + frame_num * 0.005) % 10000
            t = time_seconds * 0.02 + seed * 0.01

            # 慢速漂移
            x = (t * 0.05 + seed * 0.2) % 1.2 - 0.1
            y = 0.3 + np.sin(t * 0.3 + seed) * 0.1

            # 限制在画面内
            x = max(0, min(0.9, x))
            y = max(0.1, min(0.8, y))

            # 大小缓慢变化
            size = 80 + np.sin(t + seed) * 20

            clouds.append({'x': x, 'y': y, 'size': size})

        return clouds

    def generate_moon(self, frame_num, time_seconds):
        """生成月亮微动（光芒渐变）"""
        seed = frame_num * 0.01 % 10000
        t = time_seconds * 0.01

        # 位置几乎固定，有微小漂移
        x = 0.5 + np.sin(t * 0.1 + seed) * 0.01
        y = 0.7 + np.cos(t * 0.08 + seed) * 0.01

        # 光芒强度渐变
        glow_intensity = 0.7 + 0.3 * np.sin(t * 0.5 + seed * 2)

        return {'x': x, 'y': y, 'glow': glow_intensity}

    def generate_flower(self, frame_num, time_seconds):
        """生成花草摇曳"""
        num_flowers = 20
        flowers = []

        for i in range(num_flowers):
            seed = (i * 67 + frame_num * 0.008) % 10000
            t = time_seconds * 0.1 + seed * 0.01

            # 随机分布
            x = (i * 73 % 10) / 10 + np.sin(t * 0.2 + seed) * 0.02
            y = 0.5 + (i % 5) * 0.1 + np.cos(t * 0.3 + seed) * 0.03

            # 摇曳角度
            sway_angle = np.sin(t * 2 + seed * 3) * 0.3

            flowers.append({'x': x, 'y': y, 'angle': sway_angle})

        return flowers

    def draw_frame(self, frame_num, time_seconds):
        """绘制单帧"""
        # 创建画布
        fig = plt.figure(figsize=(12, 8), dpi=80)
        ax = plt.Axes(fig, [0, 0, 1, 1])
        fig.add_axes(ax)
        ax.axis('off')

        # 绘制背景
        ax.imshow(self.bg_image, extent=[0, 1, 0, 1], aspect='auto', interpolation='bilinear')

        # 根据元素类型绘制
        if self.element_type == 'firefly':
            positions = self.generate_firefly(frame_num, time_seconds)
            for x, y in positions:
                # 发光点
                ax.scatter([x], [y], c=COLORS['firefly']['color'],
                          s=COLORS['firefly']['size'], alpha=0.9, edgecolors='none')
                # 光晕
                ax.scatter([x], [y], c=COLORS['firefly']['glow'],
                          s=COLORS['firefly']['size']*3, alpha=0.3)

        elif self.element_type == 'water':
            waves = self.generate_water(frame_num, time_seconds)
            for wave in waves:
                points = wave['points']
                xs, ys = zip(*points)
                ax.plot(xs, ys, color=COLORS['water']['wave_color'],
                       linewidth=1, alpha=0.3 + wave['layer'] * 0.1)

        elif self.element_type == 'cloud':
            clouds = self.generate_cloud(frame_num, time_seconds)
            for cloud in clouds:
                circle = plt.Circle((cloud['x'], cloud['y']),
                                  cloud['size']/1000,
                                  color=COLORS['cloud']['color'],
                                  alpha=COLORS['cloud']['alpha'])
                ax.add_patch(circle)

        elif self.element_type == 'moon':
            moon = self.generate_moon(frame_num, time_seconds)
            # 月亮主体
            moon_circle = plt.Circle((moon['x'], moon['y']), 0.08,
                                    color=COLORS['moon']['color'])
            ax.add_patch(moon_circle)
            # 光晕
            glow_circle = plt.Circle((moon['x'], moon['y']), 0.12,
                                    color=COLORS['moon']['glow'],
                                    alpha=moon['glow'] * 0.3)
            ax.add_patch(glow_circle)

        elif self.element_type == 'flower':
            flowers = self.generate_flower(frame_num, time_seconds)
            for flower in flowers:
                # 简化：画花头
                ax.scatter([flower['x']], [flower['y']], c=COLORS['flower']['color'],
                          s=20, marker='o', alpha=0.8)

        # 添加时间标签（可选，方便查看进度）
        if frame_num % (self.fps * 60) == 0:  # 每分钟显示一次
            minutes = frame_num // self.fps // 60
            ax.text(0.02, 0.02, f'Time: {minutes} min',
                   transform=ax.transAxes, color='white', fontsize=8,
                   bbox=dict(boxstyle='round', facecolor='black', alpha=0.5))

        return fig

    def animate(self, save_as_gif=True):
        """生成动画"""
        print(f"🎬 开始生成动画: {self.element_type}, 时长: {self.duration_hours}小时")
        print(f"📁 输出文件: {self.output_path}")

        # 创建输出目录
        self.output_path.parent.mkdir(parents=True, exist_ok=True)

        # 逐帧生成
        frames = []
        for frame_num in range(0, self.total_frames, 1):  # 每1帧
            time_seconds = frame_num / self.fps

            # 进度显示
            if frame_num % (self.total_frames // 20) == 0:
                progress = (frame_num / self.total_frames) * 100
                print(f"⏳ 进度: {progress:.1f}% ({frame_num}/{self.total_frames}帧)")

            # 绘制帧
            fig = self.draw_frame(frame_num, time_seconds)

            # 保存到内存（比保存文件快）
            import io
            buf = io.BytesIO()
            fig.savefig(buf, format='png', dpi=80, bbox_inches='tight',
                       facecolor='black')
            buf.seek(0)
            img = Image.open(buf)
            frames.append(img)
            plt.close(fig)

        # 保存动画
        print(f"💾 正在保存动画...")

        # 调整GIF参数
        save_kwargs = {
            'save_all': True,
            'append_images': frames[1:],
            'duration': int(1000 / self.fps),  # ms per frame
            'loop': 0,  # 无限循环
            'optimize': True
        }

        # 如果支持，添加调色板优化
        try:
            # 减少颜色数量优化GIF大小
            palette = frames[0].copy()
            palette.quantize(colors=256, method=Image.MEDIANCUT)
            frames[0] = palette
            save_kwargs['palette'] = palette
        except:
            pass

        # 保存
        if save_as_gif and self.output_path.suffix == '.gif':
            frames[0].save(self.output_path, **save_kwargs)
            print(f"✅ GIF已保存: {self.output_path}")

        # 如果需要MP4
        elif self.output_path.suffix in ['.mp4', '.mov']:
            import imageio
            imageio.mimsave(str(self.output_path), [np.array(f) for f in frames],
                          fps=self.fps)
            print(f"✅ 视频已保存: {self.output_path}")

        print(f"🎉 完成！总帧数: {len(frames)}, 大小: {self.output_path.stat().st_size / 1024 / 1024:.2f} MB")

def main():
    parser = argparse.ArgumentParser(description='生成2小时不重复运动轨迹的元素动画')
    parser.add_argument('--input', '-i', required=True, help='背景图片路径')
    parser.add_argument('--element', '-e', required=True,
                       choices=['firefly', 'water', 'cloud', 'moon', 'flower'],
                       help='元素类型: firefly(萤火虫), water(水流), cloud(云朵), moon(月亮), flower(花草)')
    parser.add_argument('--duration', '-d', type=float, default=2,
                       help='动画时长（小时），默认2小时')
    parser.add_argument('--fps', '-f', type=int, default=10,
                       help='帧率，默认10（降低可减少文件大小）')
    parser.add_argument('--output', '-o', default='output.gif',
                       help='输出文件路径，默认output.gif')
    parser.add_argument('--mp4', action='store_true',
                       help='输出为MP4而非GIF')

    args = parser.parse_args()

    # 确定输出格式
    output_path = Path(args.output)
    if args.mp4:
        if output_path.suffix not in ['.mp4', '.mov']:
            output_path = output_path.with_suffix('.mp4')
        save_as_gif = False
    else:
        if output_path.suffix != '.gif':
            output_path = output_path.with_suffix('.gif')
        save_as_gif = True

    # 检查依赖
    try:
        if not save_as_gif:
            import imageio
    except ImportError:
        print("❌ MP4输出需要imageio库，安装: pip install imageio")
        sys.exit(1)

    # 创建动画器并运行
    try:
        animator = ElementAnimator(
            bg_path=args.input,
            element_type=args.element,
            duration_hours=args.duration,
            fps=args.fps,
            output_path=output_path
        )
        animator.animate(save_as_gif=save_as_gif)

    except Exception as e:
        print(f"❌ 错误: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
