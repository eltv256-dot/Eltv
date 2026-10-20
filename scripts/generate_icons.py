import zlib
import struct
import math
import os

def create_png(width, height, output_path, is_maskable=False):
    # Generates a pristine high-fidelity PNG icon with the elbill brand mark
    # Dark glass background, glowing rim, and cyan/sapphire play prism
    raw_data = bytearray()
    
    cx, cy = width / 2.0, height / 2.0
    corner_radius = width * 0.22
    
    for y in range(height):
        # Filter type 0 (None) at the start of each scanline
        raw_data.append(0)
        for x in range(width):
            # Distance from center
            dx = abs(x - cx)
            dy = abs(y - cy)
            
            # Squircle / rounded box test
            # Inner box dimensions
            inner_w = cx - corner_radius
            inner_h = cy - corner_radius
            
            in_shape = False
            dist_to_edge = 0.0
            
            if dx <= inner_w and dy <= inner_h:
                in_shape = True
                dist_to_edge = min(inner_w - dx, inner_h - dy) + corner_radius
            elif dx > inner_w and dy <= inner_h:
                in_shape = dx <= cx
                dist_to_edge = cx - dx
            elif dx <= inner_w and dy > inner_h:
                in_shape = dy <= cy
                dist_to_edge = cy - dy
            else:
                # Corner corner
                cdx = dx - inner_w
                cdy = dy - inner_h
                corner_dist = math.hypot(cdx, cdy)
                if corner_dist <= corner_radius:
                    in_shape = True
                    dist_to_edge = corner_radius - corner_dist
                else:
                    in_shape = False
            
            if is_maskable:
                # Full bleed background
                in_shape = True
                dist_to_edge = 20.0
            
            if not in_shape:
                # Transparent
                raw_data.extend((0, 0, 0, 0))
                continue
            
            # Anti-aliasing border
            alpha = min(1.0, max(0.0, dist_to_edge + 0.5)) if not is_maskable else 1.0
            
            # Base dark gradient (top-left #0f172a to bottom-right #050608)
            norm_diag = (x + y) / float(width + height)
            r = int(14 * (1.0 - norm_diag) + 5 * norm_diag)
            g = int(20 * (1.0 - norm_diag) + 7 * norm_diag)
            b = int(32 * (1.0 - norm_diag) + 12 * norm_diag)
            
            # Ambient cyan glow in center
            radial_dist = math.hypot(x - cx, y - cy) / (width * 0.45)
            if radial_dist < 1.0:
                glow_intensity = (1.0 - radial_dist) * 0.28
                r = int(r + 2 * glow_intensity * 255)
                g = int(g + 132 * glow_intensity * 255)
                b = int(b + 199 * glow_intensity * 255)
            
            # Specular rim highlight on top border
            if not is_maskable and dist_to_edge < 3.0:
                rim_factor = (3.0 - dist_to_edge) / 3.0
                r = int(r * (1 - rim_factor) + 56 * rim_factor)
                g = int(g * (1 - rim_factor) + 189 * rim_factor)
                b = int(b * (1 - rim_factor) + 248 * rim_factor)
            
            # Center Play Prism
            # Scale coordinates relative to center
            # Safe zone: triangle centered around (0.52, 0.5)
            px = (x - cx) / float(width)
            py = (y - cy) / float(height)
            
            # Scaled play triangle: vertices around (-0.12, -0.16), (-0.12, 0.16), (0.16, 0.0)
            # Offset slightly to visual center (+0.02)
            px -= 0.02
            
            # Check if point is inside triangle
            # Lines:
            # x >= -0.12
            # Upper line from (-0.12, -0.16) to (0.16, 0.0) -> slope dy/dx = 0.16 / 0.28 = 0.5714
            # py <= 0.5714 * (px - 0.16) is below upper slant: py - 0.5714 * px + 0.0914 <= 0 -> py <= (px - 0.16) * 0.5714 ? Wait, slope is (0 - (-0.16))/(0.16 - (-0.12)) = 0.16/0.28 > 0.
            # At px = -0.12: py = -0.16. At px = 0.16: py = 0.
            # Line equation: py - 0 = (0.16/0.28) * (px - 0.16) => py >= (0.16/0.28)*(px - 0.16)
            # Lower line from (-0.12, 0.16) to (0.16, 0.0):
            # slope = (0 - 0.16)/(0.16 - (-0.12)) = -0.16/0.28
            # py <= -(0.16/0.28)*(px - 0.16)
            
            slope = 0.16 / 0.28
            in_play = (px >= -0.12) and (py >= slope * (px - 0.16)) and (py <= -slope * (px - 0.16))
            
            if in_play:
                # Gradient inside play icon (vibrant cyan to sapphire #38bdf8 -> #1d4ed8)
                t = (px + 0.12) / 0.28
                pr = int(56 * (1.0 - t) + 29 * t)
                pg = int(189 * (1.0 - t) + 78 * t)
                pb = int(248 * (1.0 - t) + 216 * t)
                
                # Facet cut highlight
                if py < 0:
                    pr = min(255, pr + 45)
                    pg = min(255, pg + 45)
                    pb = min(255, pb + 20)
                
                r = pr
                g = pg
                b = pb
            
            # Clamp
            r = min(255, max(0, r))
            g = min(255, max(0, g))
            b = min(255, max(0, b))
            a = int(alpha * 255)
            
            raw_data.extend((r, g, b, a))
            
    # Compress IDAT chunk
    compressed = zlib.compress(bytes(raw_data), 9)
    
    def chunk(chunk_type, data):
        length = struct.pack(">I", len(data))
        crc = struct.pack(">I", zlib.crc32(chunk_type + data) & 0xffffffff)
        return length + chunk_type + data + crc
    
    png = bytearray(b"\x89PNG\r\n\x1a\n")
    # IHDR: width, height, bit depth (8), color type (6 = RGBA), compression (0), filter (0), interlace (0)
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png.extend(chunk(b"IHDR", ihdr_data))
    png.extend(chunk(b"IDAT", compressed))
    png.extend(chunk(b"IEND", b""))
    
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(png)
    print(f"Created {output_path} ({width}x{height})")

if __name__ == "__main__":
    create_png(192, 192, "public/pwa-192x192.png", is_maskable=False)
    create_png(512, 512, "public/pwa-512x512.png", is_maskable=False)
    create_png(512, 512, "public/pwa-maskable-512x512.png", is_maskable=True)
    create_png(180, 180, "public/apple-touch-icon.png", is_maskable=False)
    create_png(32, 32, "public/favicon.ico", is_maskable=False)
