// 方程求解器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const inputModeSelect = document.getElementById('input-mode');
    const directInputDiv = document.getElementById('direct-input');
    const paramsInputDiv = document.getElementById('params-input');
    const equationInput = document.getElementById('equation-input');
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
    
    // 方程解析器
    const equationParser = {
        // 解析一元一次方程
        parseLinear: function(equation) {
            // 标准化方程
            equation = this.standardizeEquation(equation);
            
            // 将方程转换为 ax + b = 0 的形式
            const sides = equation.split('=');
            if (sides.length !== 2) {
                throw new Error('无效的方程格式，请确保方程包含一个等号');
            }
            
            let leftSide = sides[0].trim();
            let rightSide = sides[1].trim();
            
            // 确保左右两侧都有内容
            if (!leftSide && !rightSide) {
                throw new Error('方程两侧不能同时为空');
            }
            
            // 将方程标准化为 ax + b = 0 的形式
            // 先处理左侧
            let leftTerms = this.extractTerms(leftSide);
            
            // 再处理右侧（符号取反）
            let rightTerms = this.extractTerms(rightSide, true);
            
            // 合并同类项
            let a = leftTerms.x + rightTerms.x;  // x 的系数
            let b = leftTerms.constant + rightTerms.constant;  // 常数项
            
            return {
                type: 'linear',
                params: { a: a, b: b },
                originalEquation: equation
            };
        },
        
        // 提取方程中的各项系数
        extractTerms: function(expression, negate = false) {
            if (!expression) {
                return { x: 0, constant: 0 };
            }
            
            // 标准化表达式，确保每个项前都有符号
            expression = expression.trim();
            if (!expression.startsWith('+') && !expression.startsWith('-')) {
                expression = '+' + expression;
            }
            
            // 分割成各项
            const termRegex = /[+\-][^+\-]*/g;
            const terms = expression.match(termRegex) || [];
            
            let xCoefficient = 0;
            let constant = 0;
            
            for (let term of terms) {
                // 确定符号
                const sign = term.startsWith('-') ? -1 : 1;
                // 如果需要取反（右侧移到左侧）
                const finalSign = negate ? -sign : sign;
                
                // 去掉符号
                term = term.substring(1).trim();
                
                // 检查是否为 x 项
                if (term.includes('x')) {
                    // 提取 x 的系数
                    let coefficient = term.replace(/x.*/g, '').trim();
                    if (coefficient === '') {
                        coefficient = '1';
                    }
                    xCoefficient += finalSign * parseFloat(coefficient || 1);
                } else if (term) {
                    // 常数项
                    constant += finalSign * parseFloat(term);
                }
            }
            
            return {
                x: xCoefficient,
                constant: constant
            };
        },
        
        // 解析一元二次方程
        parseQuadratic: function(equation) {
            // 标准化方程
            equation = this.standardizeEquation(equation);
            
            // 将方程转换为 ax² + bx + c = 0 的形式
            const sides = equation.split('=');
            if (sides.length !== 2) {
                throw new Error('无效的方程格式，请确保方程包含一个等号');
            }
            
            let leftSide = sides[0].trim();
            let rightSide = sides[1].trim();
            
            // 确保左右两侧都有内容
            if (!leftSide && !rightSide) {
                throw new Error('方程两侧不能同时为空');
            }
            
            // 标准化二次项表示
            leftSide = leftSide.replace(/x\^2/g, 'x²').replace(/x\*\*2/g, 'x²');
            rightSide = rightSide.replace(/x\^2/g, 'x²').replace(/x\*\*2/g, 'x²');
            
            // 提取左侧的项
            let leftTerms = this.extractQuadraticTerms(leftSide);
            
            // 提取右侧的项（符号取反）
            let rightTerms = this.extractQuadraticTerms(rightSide, true);
            
            // 合并同类项
            let a = leftTerms.x2 + rightTerms.x2;  // x² 的系数
            let b = leftTerms.x + rightTerms.x;    // x 的系数
            let c = leftTerms.constant + rightTerms.constant;  // 常数项
            
            return {
                type: 'quadratic',
                params: { a: a, b: b, c: c },
                originalEquation: equation
            };
        },
        
        // 提取二次方程中的各项系数
        extractQuadraticTerms: function(expression, negate = false) {
            if (!expression) {
                return { x2: 0, x: 0, constant: 0 };
            }
            
            // 标准化表达式，确保每个项前都有符号
            expression = expression.trim();
            if (!expression.startsWith('+') && !expression.startsWith('-')) {
                expression = '+' + expression;
            }
            
            // 分割成各项
            const termRegex = /[+\-][^+\-]*/g;
            const terms = expression.match(termRegex) || [];
            
            let x2Coefficient = 0;
            let xCoefficient = 0;
            let constant = 0;
            
            for (let term of terms) {
                // 确定符号
                const sign = term.startsWith('-') ? -1 : 1;
                // 如果需要取反（右侧移到左侧）
                const finalSign = negate ? -sign : sign;
                
                // 去掉符号
                term = term.substring(1).trim();
                
                // 检查是否为 x² 项
                if (term.includes('x²')) {
                    // 提取 x² 的系数
                    let coefficient = term.replace(/x².*/g, '').trim();
                    if (coefficient === '') {
                        coefficient = '1';
                    }
                    x2Coefficient += finalSign * parseFloat(coefficient || 1);
                }
                // 检查是否为 x 项（但不是 x² 项）
                else if (term.includes('x') && !term.includes('x²')) {
                    // 提取 x 的系数
                    let coefficient = term.replace(/x.*/g, '').trim();
                    if (coefficient === '') {
                        coefficient = '1';
                    }
                    xCoefficient += finalSign * parseFloat(coefficient || 1);
                }
                // 常数项
                else if (term) {
                    constant += finalSign * parseFloat(term);
                }
            }
            
            return {
                x2: x2Coefficient,
                x: xCoefficient,
                constant: constant
            };
        },
        
        // 解析二元一次方程组
        parseSystemLinear: function(equations) {
            // 分割方程组
            let equationArray = equations.split(/[,;]/);
            if (equationArray.length !== 2) {
                throw new Error('请输入两个方程，用逗号或分号分隔');
            }
            
            const eq1 = equationArray[0].trim();
            const eq2 = equationArray[1].trim();
            
            // 解析第一个方程
            const parsedEq1 = this.parseLinearWithTwoVariables(eq1);
            
            // 解析第二个方程
            const parsedEq2 = this.parseLinearWithTwoVariables(eq2);
            
            return {
                type: 'system-linear',
                params: {
                    a: parsedEq1.a,
                    b: parsedEq1.b,
                    c: parsedEq1.c,
                    d: parsedEq2.a,
                    e: parsedEq2.b,
                    f: parsedEq2.c
                },
                originalEquation: equations
            };
        },
        
        // 解析包含两个变量的一次方程
        parseLinearWithTwoVariables: function(equation) {
            // 标准化方程
            equation = this.standardizeEquation(equation);
            
            // 将方程转换为 ax + by = c 的形式
            const sides = equation.split('=');
            if (sides.length !== 2) {
                throw new Error('无效的方程格式，请确保方程包含一个等号');
            }
            
            let leftSide = sides[0].trim();
            let rightSide = sides[1].trim();
            
            // 确保左右两侧都有内容
            if (!leftSide && !rightSide) {
                throw new Error('方程两侧不能同时为空');
            }
            
            // 提取左侧的项
            let leftTerms = this.extractTwoVariableTerms(leftSide);
            
            // 提取右侧的项（符号取反）
            let rightTerms = this.extractTwoVariableTerms(rightSide, true);
            
            // 合并同类项
            let a = leftTerms.x + rightTerms.x;  // x 的系数
            let b = leftTerms.y + rightTerms.y;  // y 的系数
            let c = -(leftTerms.constant + rightTerms.constant);  // 常数项（移到右侧，所以取负）
            
            return { a: a, b: b, c: c };
        },
        
        // 提取二元一次方程中的各项系数
        extractTwoVariableTerms: function(expression, negate = false) {
            if (!expression) {
                return { x: 0, y: 0, constant: 0 };
            }
            
            // 标准化表达式，确保每个项前都有符号
            expression = expression.trim();
            if (!expression.startsWith('+') && !expression.startsWith('-')) {
                expression = '+' + expression;
            }
            
            // 分割成各项
            const termRegex = /[+\-][^+\-]*/g;
            const terms = expression.match(termRegex) || [];
            
            let xCoefficient = 0;
            let yCoefficient = 0;
            let constant = 0;
            
            for (let term of terms) {
                // 确定符号
                const sign = term.startsWith('-') ? -1 : 1;
                // 如果需要取反（右侧移到左侧）
                const finalSign = negate ? -sign : sign;
                
                // 去掉符号
                term = term.substring(1).trim();
                
                // 检查是否为 x 项
                if (term.includes('x') && !term.includes('y')) {
                    // 提取 x 的系数
                    let coefficient = term.replace(/x.*/g, '').trim();
                    if (coefficient === '') {
                        coefficient = '1';
                    }
                    xCoefficient += finalSign * parseFloat(coefficient || 1);
                }
                // 检查是否为 y 项
                else if (term.includes('y') && !term.includes('x')) {
                    // 提取 y 的系数
                    let coefficient = term.replace(/y.*/g, '').trim();
                    if (coefficient === '') {
                        coefficient = '1';
                    }
                    yCoefficient += finalSign * parseFloat(coefficient || 1);
                }
                // 检查是否同时包含 x 和 y（如 xy 项）
                else if (term.includes('x') && term.includes('y')) {
                    throw new Error('不支持包含 xy 项的方程');
                }
                // 常数项
                else if (term) {
                    constant += finalSign * parseFloat(term);
                }
            }
            
            return {
                x: xCoefficient,
                y: yCoefficient,
                constant: constant
            };
        },
        
        // 标准化方程表达式
        standardizeEquation: function(equation) {
            // 移除所有空格
            equation = equation.replace(/\s+/g, '');
            
            // 确保 + 和 - 前后有空格
            equation = equation.replace(/([+-])/g, ' $1 ');
            
            // 处理方程开头的 +/-
            equation = equation.replace(/^\s*\+\s*/, '');
            
            // 处理 = 号前后的空格
            equation = equation.replace(/\s*=\s*/, ' = ');
            
            // 处理连续的操作符
            equation = equation.replace(/\+\s*\+/g, '+');
            equation = equation.replace(/\+\s*-/g, '-');
            equation = equation.replace(/-\s*\+/g, '-');
            equation = equation.replace(/-\s*-/g, '+');
            
            return equation;
        },
        
        // 自动检测方程类型并解析
        parseEquation: function(input) {
            input = input.trim();
            
            // 检查是否为方程组
            if (input.includes(',') || input.includes(';')) {
                return this.parseSystemLinear(input);
            }
            
            // 检查是否为二次方程
            if (input.includes('x²') || input.includes('x^2') || input.includes('x**2')) {
                return this.parseQuadratic(input);
            }
            
            // 检查是否包含 y 变量（二元一次方程）
            if (input.includes('y')) {
                throw new Error('单个二元方程无法求解，请输入方程组');
            }
            
            // 默认为一元一次方程
            return this.parseLinear(input);
        }
    };
    
    // 初始化输入模式选择
    inputModeSelect.addEventListener('change', function() {
        updateInputMode();
    });
    
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
        if (inputModeSelect.value === 'direct') {
            equationInput.value = '';
        } else {
            updateEquationParams();
        }
        resultDiv.innerHTML = '<h3>求解结果</h3><p>请输入方程并点击求解按钮</p>';
    });
    
    // 更新输入模式
    function updateInputMode() {
        const mode = inputModeSelect.value;
        
        if (mode === 'direct') {
            directInputDiv.style.display = 'block';
            paramsInputDiv.style.display = 'none';
        } else {
            directInputDiv.style.display = 'none';
            paramsInputDiv.style.display = 'block';
            updateEquationParams();
        }
    }
    
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
        try {
            let equationType, params, originalEquation;
            
            // 根据输入模式获取参数
            if (inputModeSelect.value === 'direct') {
                const input = equationInput.value.trim();
                
                if (!input) {
                    showError('请输入方程');
                    return;
                }
                
                // 解析方程
                const parsedEquation = equationParser.parseEquation(input);
                equationType = parsedEquation.type;
                params = parsedEquation.params;
                originalEquation = parsedEquation.originalEquation;
            } else {
                equationType = equationTypeSelect.value;
                
                // 收集参数
                params = {};
                for (const param of equationDefinitions[equationType].params) {
                    const input = document.getElementById(param.id);
                    params[param.id] = input.value;
                    
                    if (!input.value || isNaN(parseFloat(input.value))) {
                        showError(`请为${param.name}输入有效的数值`);
                        return;
                    }
                }
            }
            
            const equation = equationDefinitions[equationType];
            
            // 求解方程
            const result = equation.solve(params);
            
            // 显示结果
            let html = `<h3>${equation.name}求解结果</h3>`;
            
            // 如果是直接输入模式，显示原始方程
            if (inputModeSelect.value === 'direct' && originalEquation) {
                html += `<p><strong>原始方程：</strong>${originalEquation}</p>`;
                
                // 显示转换后的标准形式
                if (equationType === 'linear') {
                    html += `<p><strong>标准形式：</strong>${params.a}x + ${params.b} = 0</p>`;
                } else if (equationType === 'quadratic') {
                    html += `<p><strong>标准形式：</strong>${params.a}x² + ${params.b}x + ${params.c} = 0</p>`;
                } else if (equationType === 'system-linear') {
                    html += `<p><strong>标准形式：</strong><br>
                            ${params.a}x + ${params.b}y = ${params.c}<br>
                            ${params.d}x + ${params.e}y = ${params.f}</p>`;
                }
            }
            
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
    updateInputMode();
    updateEquationParams();
    
    // 添加键盘事件监听
    equationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            solveBtn.click();
        }
    });
});
