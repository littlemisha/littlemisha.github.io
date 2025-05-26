// 几何计算器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const shapeTypeSelect = document.getElementById('shape-type');
    const shapeParamsDiv = document.getElementById('shape-params');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDiv = document.getElementById('result');
    
    // 图形定义
    const shapeDefinitions = {
        circle: {
            name: '圆形',
            params: [
                { id: 'radius', name: '半径', unit: '单位' }
            ],
            calculate: function(params) {
                const radius = parseFloat(params.radius);
                const area = Math.PI * radius * radius;
                const perimeter = 2 * Math.PI * radius;
                
                return {
                    area: area,
                    perimeter: perimeter
                };
            },
            formatResult: function(result) {
                return `
                    <p><strong>面积：</strong>${result.area.toFixed(4)} 平方单位</p>
                    <p><strong>周长：</strong>${result.perimeter.toFixed(4)} 单位</p>
                `;
            }
        },
        rectangle: {
            name: '矩形',
            params: [
                { id: 'length', name: '长', unit: '单位' },
                { id: 'width', name: '宽', unit: '单位' }
            ],
            calculate: function(params) {
                const length = parseFloat(params.length);
                const width = parseFloat(params.width);
                const area = length * width;
                const perimeter = 2 * (length + width);
                const diagonal = Math.sqrt(length * length + width * width);
                
                return {
                    area: area,
                    perimeter: perimeter,
                    diagonal: diagonal
                };
            },
            formatResult: function(result) {
                return `
                    <p><strong>面积：</strong>${result.area.toFixed(4)} 平方单位</p>
                    <p><strong>周长：</strong>${result.perimeter.toFixed(4)} 单位</p>
                    <p><strong>对角线：</strong>${result.diagonal.toFixed(4)} 单位</p>
                `;
            }
        },
        square: {
            name: '正方形',
            params: [
                { id: 'side', name: '边长', unit: '单位' }
            ],
            calculate: function(params) {
                const side = parseFloat(params.side);
                const area = side * side;
                const perimeter = 4 * side;
                const diagonal = Math.sqrt(2) * side;
                
                return {
                    area: area,
                    perimeter: perimeter,
                    diagonal: diagonal
                };
            },
            formatResult: function(result) {
                return `
                    <p><strong>面积：</strong>${result.area.toFixed(4)} 平方单位</p>
                    <p><strong>周长：</strong>${result.perimeter.toFixed(4)} 单位</p>
                    <p><strong>对角线：</strong>${result.diagonal.toFixed(4)} 单位</p>
                `;
            }
        },
        triangle: {
            name: '三角形',
            params: [
                { id: 'side1', name: '边长1', unit: '单位' },
                { id: 'side2', name: '边长2', unit: '单位' },
                { id: 'side3', name: '边长3', unit: '单位' }
            ],
            calculate: function(params) {
                const a = parseFloat(params.side1);
                const b = parseFloat(params.side2);
                const c = parseFloat(params.side3);
                
                // 检查三角形是否有效
                if (a + b <= c || a + c <= b || b + c <= a) {
                    throw new Error('无法构成三角形，任意两边之和必须大于第三边');
                }
                
                const perimeter = a + b + c;
                const s = perimeter / 2; // 半周长
                const area = Math.sqrt(s * (s - a) * (s - b) * (s - c)); // 海伦公式
                
                // 判断三角形类型
                let type = '';
                if (a === b && b === c) {
                    type = '等边三角形';
                } else if (a === b || b === c || a === c) {
                    type = '等腰三角形';
                } else {
                    type = '不等边三角形';
                }
                
                // 使用余弦定理判断是否为直角三角形
                const sides = [a, b, c].sort((x, y) => x - y);
                const isRightAngled = Math.abs(sides[0] * sides[0] + sides[1] * sides[1] - sides[2] * sides[2]) < 0.0001;
                
                if (isRightAngled) {
                    type += '（直角三角形）';
                }
                
                return {
                    area: area,
                    perimeter: perimeter,
                    type: type
                };
            },
            formatResult: function(result) {
                return `
                    <p><strong>面积：</strong>${result.area.toFixed(4)} 平方单位</p>
                    <p><strong>周长：</strong>${result.perimeter.toFixed(4)} 单位</p>
                    <p><strong>三角形类型：</strong>${result.type}</p>
                `;
            }
        },
        trapezoid: {
            name: '梯形',
            params: [
                { id: 'top', name: '上底', unit: '单位' },
                { id: 'bottom', name: '下底', unit: '单位' },
                { id: 'height', name: '高', unit: '单位' },
                { id: 'left', name: '左边长', unit: '单位' },
                { id: 'right', name: '右边长', unit: '单位' }
            ],
            calculate: function(params) {
                const a = parseFloat(params.top);
                const c = parseFloat(params.bottom);
                const h = parseFloat(params.height);
                const b = parseFloat(params.left);
                const d = parseFloat(params.right);
                
                const area = (a + c) * h / 2;
                const perimeter = a + b + c + d;
                
                return {
                    area: area,
                    perimeter: perimeter
                };
            },
            formatResult: function(result) {
                return `
                    <p><strong>面积：</strong>${result.area.toFixed(4)} 平方单位</p>
                    <p><strong>周长：</strong>${result.perimeter.toFixed(4)} 单位</p>
                `;
            }
        },
        sphere: {
            name: '球体',
            params: [
                { id: 'radius', name: '半径', unit: '单位' }
            ],
            calculate: function(params) {
                const radius = parseFloat(params.radius);
                const volume = (4/3) * Math.PI * Math.pow(radius, 3);
                const surfaceArea = 4 * Math.PI * radius * radius;
                
                return {
                    volume: volume,
                    surfaceArea: surfaceArea
                };
            },
            formatResult: function(result) {
                return `
                    <p><strong>体积：</strong>${result.volume.toFixed(4)} 立方单位</p>
                    <p><strong>表面积：</strong>${result.surfaceArea.toFixed(4)} 平方单位</p>
                `;
            }
        },
        cube: {
            name: '立方体',
            params: [
                { id: 'side', name: '边长', unit: '单位' }
            ],
            calculate: function(params) {
                const side = parseFloat(params.side);
                const volume = Math.pow(side, 3);
                const surfaceArea = 6 * side * side;
                const diagonal = Math.sqrt(3) * side;
                
                return {
                    volume: volume,
                    surfaceArea: surfaceArea,
                    diagonal: diagonal
                };
            },
            formatResult: function(result) {
                return `
                    <p><strong>体积：</strong>${result.volume.toFixed(4)} 立方单位</p>
                    <p><strong>表面积：</strong>${result.surfaceArea.toFixed(4)} 平方单位</p>
                    <p><strong>对角线：</strong>${result.diagonal.toFixed(4)} 单位</p>
                `;
            }
        },
        cylinder: {
            name: '圆柱体',
            params: [
                { id: 'radius', name: '底面半径', unit: '单位' },
                { id: 'height', name: '高', unit: '单位' }
            ],
            calculate: function(params) {
                const radius = parseFloat(params.radius);
                const height = parseFloat(params.height);
                const volume = Math.PI * radius * radius * height;
                const lateralArea = 2 * Math.PI * radius * height;
                const baseArea = Math.PI * radius * radius;
                const totalSurfaceArea = lateralArea + 2 * baseArea;
                
                return {
                    volume: volume,
                    lateralArea: lateralArea,
                    baseArea: baseArea,
                    totalSurfaceArea: totalSurfaceArea
                };
            },
            formatResult: function(result) {
                return `
                    <p><strong>体积：</strong>${result.volume.toFixed(4)} 立方单位</p>
                    <p><strong>侧面积：</strong>${result.lateralArea.toFixed(4)} 平方单位</p>
                    <p><strong>底面积：</strong>${result.baseArea.toFixed(4)} 平方单位</p>
                    <p><strong>表面积：</strong>${result.totalSurfaceArea.toFixed(4)} 平方单位</p>
                `;
            }
        }
    };
    
    // 初始化图形类型选择
    shapeTypeSelect.addEventListener('change', function() {
        updateShapeParams();
    });
    
    // 计算按钮点击事件
    calculateBtn.addEventListener('click', function() {
        calculateShape();
    });
    
    // 清除按钮点击事件
    clearBtn.addEventListener('click', function() {
        updateShapeParams();
        resultDiv.innerHTML = '<h3>计算结果</h3><p>请选择图形并输入参数</p>';
    });
    
    // 更新图形参数输入区域
    function updateShapeParams() {
        const shapeType = shapeTypeSelect.value;
        const shape = shapeDefinitions[shapeType];
        
        let html = '';
        
        for (const param of shape.params) {
            html += `
                <div class="input-group">
                    <label for="${param.id}">${param.name} (${param.unit})：</label>
                    <input type="number" id="${param.id}" step="any" min="0" value="1">
                </div>
            `;
        }
        
        shapeParamsDiv.innerHTML = html;
    }
    
    // 计算图形
    function calculateShape() {
        const shapeType = shapeTypeSelect.value;
        const shape = shapeDefinitions[shapeType];
        
        // 收集参数
        const params = {};
        for (const param of shape.params) {
            const input = document.getElementById(param.id);
            params[param.id] = input.value;
            
            if (!input.value || isNaN(parseFloat(input.value)) || parseFloat(input.value) <= 0) {
                showError(`请为${param.name}输入有效的正数值`);
                return;
            }
        }
        
        try {
            // 计算结果
            const result = shape.calculate(params);
            
            // 显示结果
            const formattedResult = shape.formatResult(result);
            resultDiv.innerHTML = `
                <h3>${shape.name}计算结果</h3>
                ${formattedResult}
            `;
        } catch (error) {
            showError(error.message);
        }
    }
    
    // 显示错误信息
    function showError(message) {
        resultDiv.innerHTML = `
            <h3>计算结果</h3>
            <p class="error">${message}</p>
        `;
    }
    
    // 初始化页面
    updateShapeParams();
});
