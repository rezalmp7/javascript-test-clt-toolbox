'use strict';

function LayupDrawer() {
    /**
     * Canvas element
     */
    this.imageBackground = [];
    this.canvas = null;
    this.ctx = null;
    this.dataValue = null;
    this.areaChart = {
        'top' : 10,
        'bottom' : 250,
        'left' : 100,
        'right' : 450
    }
    this.topLineChart = 10
    this.valueChart = null;

    this.LengthYLine = this.areaChart.bottom - this.areaChart.top;
    this.LengthXLine = this.areaChart.right - this.areaChart.left;
    this.beetweenMainYLine = this.LengthYLine / 5;
    this.beetweenSecondaryYLine = this.beetweenMainYLine / 5;
    this.beetweenMainXLine = this.LengthXLine / 5;
    this.beetweenSecondaryXLine = this.beetweenMainXLine / 5;
    this.beetweenValueMainYLine = null;
    this.beetweenValueMainXLine = null;
    this.perbandinganChartLengthValue = null;
}

LayupDrawer.prototype = {
    /**
     * Configure the canvas
     *
     * @param {HTMLCanvasElement} canvas  Canvas element
     */
    init : function (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    },

    /**
     * Draw a layup configuration on the canvas
     *
     * @param {Object} layup Layup object structure
     * @param {Number} length Layup length in mm
     */
    drawLayup : function (layup, length) {
        this.valueChart = {
            'y' : Object.values(layup).reduce((a, b) => a = a+b.thickness, 0),
            'x' : 150
        }

        this.perbandinganChartLengthValue = this.LengthYLine / this.valueChart.y;
        this.dataValue = layup;
        this.drawLineChart();

        this.drawValueData();
    },

    drawLineChart : function() {
        this.drawLine(this.ctx, this.areaChart.left, this.areaChart.top, this.areaChart.left, this.areaChart.bottom, "#000");
        this.drawLine(this.ctx, this.areaChart.left, this.areaChart.bottom, this.areaChart.right, this.areaChart.bottom, "#000");

        //calculate line 
        this.beetweenValueMainYLine = this.valueChart.y / 5;
        this.beetweenValueMainXLine = this.valueChart.x / 5;

        //drawing y line label Chart
        let drawingLineY = 0;
        for (let index = 0; index <= 5; index++) {
            drawingLineY = this.areaChart.bottom - (index*this.beetweenMainYLine);
            this.drawLine(this.ctx, this.areaChart.left, drawingLineY, this.areaChart.left-10, drawingLineY, "#000");
            this.drawText(this.ctx, this.beetweenValueMainYLine*index, "right", this.areaChart.left-15, drawingLineY+6);
            if(index < 5) {
                for (let index2 = 1; index2 < 5; index2++) {
                    this.drawLine(this.ctx, this.areaChart.left-5, drawingLineY-(index2*this.beetweenSecondaryYLine), this.areaChart.left, drawingLineY-(index2*this.beetweenSecondaryYLine), "#000");
                }
            }
        }

        //drawing x line label Chart
        let drawingLineX = 0;
        for (let index = 0; index <= 5; index++) {
            drawingLineX = this.areaChart.left + (index*this.beetweenMainXLine);
            this.drawLine(this.ctx, drawingLineX, this.areaChart.bottom , drawingLineX, this.areaChart.bottom+10, "#000");
            this.drawText(this.ctx, this.beetweenValueMainXLine*index, "center", drawingLineX, this.areaChart.bottom+25, 'italic');
            if(index < 5) {
                for (let index2 = 1; index2 < 5; index2++) {
                    this.drawLine(this.ctx, drawingLineX+(index2*this.beetweenSecondaryXLine), this.areaChart.bottom , drawingLineX+(index2*this.beetweenSecondaryXLine), this.areaChart.bottom+5, "#000");
                }
            }
        }
        //

        this.drawText(this.ctx, "Slab Thickness (mm)", "center", -120, 50,'', -1.56);
        this.drawText(this.ctx, "Primary Direction", "center", 270, 300,'', 0);
    },

    drawValueData: function() {
        let data = this.dataValue = Object.values(this.dataValue);
        let topElementWood = this.areaChart.top;
        data.forEach((element, index) => {
            let beforeTop = topElementWood;
            topElementWood = topElementWood + element.thickness*this.perbandinganChartLengthValue;
            let coordinate = {
                x1 : this.areaChart.left,
                y1 : beforeTop,
                x2 : this.areaChart.right,
                y2 : beforeTop,
                x3 : this.areaChart.right,
                y3 : topElementWood,
                x4 : this.areaChart.left,
                y4 : topElementWood,
            }

            let height = beforeTop - topElementWood;
            let aHalfHeight = height/2;

            this.drawText(this.ctx, element.label+": "+element.thickness+" "+element.grade, "left", this.areaChart.right+15, beforeTop-aHalfHeight);

            if(element.angle == 0) {
                this.drawPolygonWithBackground(this.ctx, index, coordinate, document.getElementById('perpandicular90'), element);
            } else {
                this.drawPolygonWithBackground(this.ctx, index, coordinate, document.getElementById('paralel0'), element);
            }
        });
    },

    drawLine : function(ctx, startX, startY, endX, endY, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    },

    drawText : function(ctx, text, textAlign, positionX, positionY, transformation, rotate=0) {
        ctx.save();
        ctx.textAlign = textAlign;
        ctx.rotate(rotate);
        // ctx.setTextSkewX('-0.25');
        ctx.font = transformation+" 12px Arial";
        ctx.fillText(text,positionX,positionY);
        ctx.restore();
    },

    drawPolygon : function(ctx) {
        ctx.save();
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(this.areaChart.left, this.areaChart.bottom);
        ctx.lineTo(this.areaChart.right, this.areaChart.bottom);
        ctx.lineTo(this.areaChart.right, this.areaChart.bottom-50);
        ctx.lineTo(this.areaChart.left, this.areaChart.bottom-50);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    
    drawPolygonWithBackground : function(ctx, index, coordinate, pathImage, dataValue) {
        ctx.save();
        ctx.beginPath ();
        ctx.moveTo(coordinate.x1, coordinate.y1);
        ctx.lineTo(coordinate.x2, coordinate.y2);
        ctx.lineTo(coordinate.x3, coordinate.y3);
        ctx.lineTo(coordinate.x4, coordinate.y4);
        ctx.closePath ();

        const w = pathImage.naturalWidth;
        const h = pathImage.naturalHeight;

        let aspectRatio;

        if (w > h) {
            aspectRatio = w / h;
        } else {
            aspectRatio = h / w;
        }
        let height = coordinate.y3 - coordinate.y1;

        ctx.clip ();
        let width = height*aspectRatio;
        ctx.drawImage (pathImage, coordinate.x1, coordinate.y1, height*aspectRatio, height);
        ctx.drawImage (pathImage, coordinate.x1+width, coordinate.y1, height*aspectRatio, height);
        for (let index = 0; index < 40; index++) {
            width = width+height*aspectRatio;
            ctx.drawImage (pathImage, coordinate.x1+width, coordinate.y1, height*aspectRatio, height);
        }
        ctx.restore();
        ctx.stroke ();
    }
    /**
     * Add more functions as you need
     */
};