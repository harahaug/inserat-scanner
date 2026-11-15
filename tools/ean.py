#!/usr/bin/env python3
"""Liest EAN/UPC-Barcodes aus Fotos (Bild fuer Bild, alle Drehungen, mehrere Skalierungen).
Aufruf: python3 tools/ean.py foto1.jpg foto2.jpg ...   -> gibt gefundene Codes aus."""
import sys, cv2
det = cv2.barcode.BarcodeDetector()
def decode(path):
    im = cv2.imread(path)
    if im is None: return []
    found = []
    for rot in (None, cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180, cv2.ROTATE_90_COUNTERCLOCKWISE):
        img = im if rot is None else cv2.rotate(im, rot)
        for scale in (1.0, 0.6, 1.5):
            s = cv2.resize(img, None, fx=scale, fy=scale) if scale != 1.0 else img
            ok, info, types, _ = det.detectAndDecodeWithType(s)
            if ok:
                for t, c in zip(types, info):
                    if c and (c, t) not in found: found.append((c, t))
        if found: break
    return found
for p in sys.argv[1:]:
    r = decode(p)
    print(p.split('/')[-2] + '/' + p.split('/')[-1], '->', ', '.join(f'{c} ({t})' for c, t in r) or 'kein Code')
