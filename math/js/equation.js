// 方程求解器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const equationTypeSelect = document.getElementById('equation-type');
    const equationParamsDiv = document.getElementById('equation-params');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDiv = document.getElementById('result');
    
    // 方程类型定义
    const equationDefinitions = {
        linear: {
            name: '一元一次方程',
            params: [
                { id: 'a', name: 'a', description: 'ax + b = 0 中的系数 a' },
                { id: 'b', name: 'b', description: 'ax + b = 0 中的常数项 b' }
            ],
            solve: function(params) {
                const a = parseFloat(params.a);
                const b = parseFloat(params.b);
                
                if (a === 0) {
                    if (b === 0) {
                        return {
                            type: 'infinite',
                            message: '方程有无穷多解'
                        };
                    } else {
                        return {
                            type: 'none',
                            message: '方程无解'
                        };
                    }
                }
                
                const x = -b / a;
                
                return {
                    type: 'single',
                    solution: { x: x },
                    steps: [
                        `原方程：${a}x + ${b} = 0`,
                        `移项：${a}x = ${-b}`,
                        `两边同除以 ${a}：x = ${-b} / ${a}`,
                        `解得：x = ${x}`
                    ]
                };
            }
        },
        quadratic: {
            name: '一元二次方程',
            params: [
                { id: 'a', name: 'a', description: 'ax² + bx + c = 0 中的系数 a' },
                { id: 'b', name: 'b', description: 'ax² + bx + c = 0 中的系数 b' },
                { id: 'c', name: 'c', description: 'ax² + bx + c = 0 中的常数项 c' }
            ],
            solve: function(params) {
                const a = parseFloat(params.a);
                const b = parseFloat(params.b);
                const c = parseFloat(params.c);
                
                if (a === 0) {
                    // 退化为一次方程
                    if (b === 0) {
                        if (c === 0) {
                            return {
                                type: 'infinite',
                                message: '方程有无穷多解'
                            };
                        } else {
                            return {
                                type: 'none',
                                message: '方程无解'
                            };
                        }
                    }
                    
                    const x = -c / b;
                    
                    return {
                        type: 'single',
                        solution: { x: x },
                        steps: [
                            `原方程：${b}x + ${c} = 0 (a = 0，退化为一次方程)`,
                            `移项：${b}x = ${-c}`,
                            `两边同除以 ${b}：x = ${-c} / ${b}`,
                            `解得：x = ${x}`
                        ]
                    };
                }
                
                // 计算判别式
                const delta = b * b - 4 * a * c;
                const steps = [
                    `原方程：${a}x² + ${b}x + ${c} = 0`,
                    `计算判别式：Δ = b² - 4ac = ${b}² - 4 × ${a} × ${c} = ${delta}`
                ];
                
                if (delta < 0) {
                    // 无实数解
                    steps.push(`由于判别式 Δ < 0，方程在实数范围内无解`);
                    
                    // 计算复数解
                    const realPart = -b / (2 * a);
                    const imagPart = Math.sqrt(-delta) / (2 * a);
                    
                    steps.push(`在复数范围内，方程有两个解：`);
                    steps.push(`x₁ = ${realPart} + ${imagPart}i`);
                    steps.push(`x₂ = ${realPart} - ${imagPart}i`);
                    
                    return {
                        type: 'complex',
                        solution: {
                            x1: { real: realPart, imag: imagPart },
                            x2: { real: realPart, imag: -imagPart }
                        },
                        steps: steps
                    };
                } else if (delta === 0) {
                    // 唯一解
                    const x = -b / (2 * a);
                    
                    steps.push(`由于判别式 Δ = 0，方程有唯一解`);
                    steps.push(`x = -b / (2a) = ${-b} / (2 × ${a}) = ${x}`);
                    
                    return {
                        type: 'double',
                        solution: { x: x },
                        steps: steps
                    };
                } else {
                    // 两个不同的解
                    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
                    const x2 = (-b - Math.sqrt(delta)) / (2 * a);
                    
                    steps.push(`由于判别式 Δ > 0，方程有两个不同的解`);
                    steps.push(`x₁ = (-b + √Δ) / (2a) = (${-b} + √${delta}) / (2 × ${a}) = ${x1}`);
                    steps.push(`x₂ = (-b - √Δ) / (2a) = (${-b} - √${delta}) / (2 × ${a}) = ${x2}`);
                    
                    return {
                        type: 'two',
                        solution: { x1: x1, x2: x2 },
                        steps: steps
                    };
                }
            }
        },
        'system-linear': {
            name: '二元一次方程组',
            params: [
                { id: 'a', name: 'a', description: 'ax + by = c 中的系数 a' },
                { id: 'b', name: 'b', description: 'ax + by = c 中的系数 b' },
                { id: 'c', name: 'c', description: 'ax + by = c 中的常数项 c' },
                { id: 'd', name: 'd', description: 'dx + ey = f 中的系数 d' },
                { id: 'e', name: 'e', description: 'dx + ey = f 中的系数 e' },
                { id: 'f', name: 'f', description: 'dx + ey = f 中的常数项 f' }
            ],
            solve: function(params) {
                const a = parseFloat(params.a);
                const b = parseFloat(params.b);
                const c = parseFloat(params.c);
                const d = parseFloat(params.d);
                const e = parseFloat(params.e);
                const f = parseFloat(params.f);
                
                // 计算行列式
                const det = a * e - b * d;
                
                const steps = [
                    `原方程组：`,
                    `${a}x + ${b}y = ${c}`,
                    `${d}x + ${e}y = ${f}`,
                    `计算行列式：det = ae - bd = ${a} × ${e} - ${b} × ${d} = ${det}`
                ];
                
                if (det === 0) {
                    // 行列式为0，可能无解或有无穷多解
                    const ratio1 = a !== 0 ? c / a : (b !== 0 ? c / b : 0);
                    const ratio2 = d !== 0 ? f / d : (e !== 0 ? f / e : 0);
                    
                    if (ratio1 === ratio2) {
                        // 两个方程成比例，有无穷多解
                        steps.push(`由于行列式为0，且两个方程成比例，方程组有无穷多解`);
                        
                        let paramEq = '';
                        if (a !== 0) {
                            paramEq = `x = (${c} - ${b}y) / ${a}`;
                        } else if (b !== 0) {
                            paramEq = `y = ${c} / ${b}`;
                        }
                        
                        steps.push(`解可以表示为：${paramEq}，其中y为任意实数`);
                        
                        return {
                            type: 'infinite',
                            message: '方程组有无穷多解',
                            steps: steps
                        };
                    } else {
                        // 两个方程不成比例，无解
                        steps.push(`由于行列式为0，且两个方程不成比例，方程组无解`);
                        
                        return {
                            type: 'none',
                            message: '方程组无解',
                            steps: steps
                        };
                    }
                } else {
                    // 行列式不为0，有唯一解
                    const x = (c * e - b * f) / det;
                    const y = (a * f - c * d) / det;
                    
                    steps.push(`由于行列式不为0，方程组有唯一解`);
                    steps.push(`使用克莱默法则：`);
                    steps.push(`x = (ce - bf) / det = (${c} × ${e} - ${b} × ${f}) / ${det} = ${x}`);
                    steps.push(`y = (af - cd) / det = (${a} × ${f} - ${c} × ${d}) / ${det} = ${y}`);
                    
                    // 验证解
                    const eq1 = a * x + b * y;
                    const eq2 = d * x + e * y;
                    
                    steps.push(`验证：`);
                    steps.push(`${a} × ${x} + ${b} × ${y} = ${eq1.toFixed(10)} ≈ ${c}`);
                    steps.push(`${d} × ${x} + ${e} × ${y} = ${eq2.toFixed(10)} ≈ ${f}`);
                    
                    return {
                        type: 'unique',
                        solution: { x: x, y: y },
                        steps: steps
                    };
                }
            }
        }
    };
    
    // 初始化方程类型选择
    equationTypeSelect.addEventListener('change', function() {
        updateEquationParams();
    });
    
    // 求解按钮点击事件
    solveBtn.addEventListener('click', function() {
        solveEquation();
    });
    
    // 清除按钮点击事件
    clearBtn.addEventListener('click', function() {
        updateEquationParams();
        resultDiv.innerHTML = '<h3>求解结果</h3><p>请输入方程参数并点击求解按钮</p>';
    });
    
    // 更新方程参数输入区域
    function updateEquationParams() {
        const equationType = equationTypeSelect.value;
        const equation = equationDefinitions[equationType];
        
        let html = '';
        
        for (const param of equation.params) {
            html += `
                <div class="input-group">
                    <label for="${param.id}">${param.name}：</label>
                    <input type="number" id="${param.id}" step="any" value="1">
                    <small>${param.description}</small>
                </div>
            `;
        }
        
        equationParamsDiv.innerHTML = html;
    }
    
    // 求解方程
    function solveEquation() {
        const equationType = equationTypeSelect.value;
        const equation = equationDefinitions[equationType];
        
        // 收集参数
        const params = {};
        for (const param of equation.params) {
            const input = document.getElementById(param.id);
            params[param.id] = input.value;
            
            if (!input.value || isNaN(parseFloat(input.value))) {
                showError(`请为${param.name}输入有效的数值`);
                return;
            }
        }
        
        try {
            // 求解方程
            const result = equation.solve(params);
            
            // 显示结果
            let html = `<h3>${equation.name}求解结果</h3>`;
            
            if (result.type === 'none') {
                html += `<p class="error">${result.message}</p>`;
            } else if (result.type === 'infinite') {
                html += `<p>${result.message}</p>`;
            } else if (result.type === 'single' || result.type === 'double') {
                html += `<p><strong>解：</strong>x = ${result.solution.x}</p>`;
            } else if (result.type === 'two') {
                html += `
                    <p><strong>解：</strong></p>
                    <p>x₁ = ${result.solution.x1}</p>
                    <p>x₂ = ${result.solution.x2}</p>
                `;
            } else if (result.type === 'complex') {
                const x1Real = result.solution.x1.real;
                const x1Imag = result.solution.x1.imag;
                const x2Real = result.solution.x2.real;
                const x2Imag = result.solution.x2.imag;
                
                html += `
                    <p><strong>复数解：</strong></p>
                    <p>x₁ = ${x1Real} + ${x1Imag}i</p>
                    <p>x₂ = ${x2Real} ${x2Imag < 0 ? '' : '+'} ${x2Imag}i</p>
                `;
            } else if (result.type === 'unique') {
                html += `
                    <p><strong>解：</strong></p>
                    <p>x = ${result.solution.x}</p>
                    <p>y = ${result.solution.y}</p>
                `;
            }
            
            // 显示求解步骤
            if (result.steps && result.steps.length > 0) {
                html += `<h4>求解步骤：</h4><ol>`;
                for (const step of result.steps) {
                    html += `<li>${step}</li>`;
                }
                html += `</ol>`;
            }
            
            resultDiv.innerHTML = html;
        } catch (error) {
            showError(error.message);
        }
    }
    
    // 显示错误信息
    function showError(message) {
        resultDiv.innerHTML = `
            <h3>求解结果</h3>
            <p class="error">${message}</p>
        `;
    }
    
    // 初始化页面
    updateEquationParams();
});
