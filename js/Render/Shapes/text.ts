/**
 * Created by isp on 8/13/17.
 */

export = (context: CanvasRenderingContext2D,
          geometry: any, style?: any): void => {
    
    if (style.font) {
        context.font = geometry.font;
    }
    if (style.fillStyle) {
        context.fillStyle = geometry.fillStyle;
    }
    context.fillText(geometry.text, geometry.x, geometry.y);
};