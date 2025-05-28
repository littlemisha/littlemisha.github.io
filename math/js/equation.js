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
    
    // 根号表示工具函数
    const mathUtils = {
        // 判断一个数是否为完全平方数
        isPerfectSquare: function(num) {
            if (num < 0) return false;
            const sqrt = Math.sqrt(num);
            return Math.abs(sqrt - Math.round(sqrt)) < 1e-10;
        },
        
        // 判断一个数是否可能是无理数
        isLikelyIrrational: function(num) {
            // 检查常见的无理数值
            const commonIrrationals = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15];
            
            for (let n of commonIrrationals) {
                // 检查是否接近于√n
                const sqrtN = Math.sqrt(n);
                if (Math.abs(num - sqrtN) < 1e-10 || Math.abs(num + sqrtN) < 1e-10) {
                    return true;
                }
                
                // 检查是否接近于√n的倍数或分数
                for (let i = 2; i <= 10; i++) {
                    if (Math.abs(num - sqrtN * i) < 1e-10 || 
                        Math.abs(num + sqrtN * i) < 1e-10 ||
                        Math.abs(num - sqrtN / i) < 1e-10 || 
                        Math.abs(num + sqrtN / i) < 1e-10) {
                        return true;
                    }
                }
            }
            
            return false;
        },
        
        // 获取一个数的最大平方因子
        getMaxSquareFactor: function(num) {
            if (num === 0) return { factor: 0, root: 1 };
            
            const absNum = Math.abs(num);
            let factor = 1;
            let root = absNum;
            
            // 查找最大平方因子
            for (let i = 2; i * i <= absNum; i++) {
                while (root % (i * i) === 0) {
                    factor *= i;
                    root /= (i * i);
                }
            }
            
            return {
                factor: factor,
                root: root
            };
        },
        
        // 将数字表示为根号形式（如果可能）
        formatAsRadical: function(num) {
            // 如果是整数，直接返回
            if (Number.isInteger(num)) {
                return num.toString();
            }
            
            // 检查是否为无理数（根号形式）
            const radical = this.toRadical(num);
            if (radical) {
                return radical;
            }
            
            // 尝试将数字表示为分数
            const fraction = this.toFraction(num);
            if (fraction) {
                return fraction;
            }
            
            // 如果无法表示为根号形式或分数，则保留4位小数
            return num.toFixed(4);
        },
        
        // 将数字表示为分数（如果是有理数）
        toFraction: function(num, tolerance = 1.0E-10) {
            if (Number.isInteger(num)) {
                return num.toString();
            }
            
            // 如果可能是无理数，不要转换为分数
            if (this.isLikelyIrrational(num)) {
                return null;
            }
            
            // 简单情况处理
            if (Math.abs(num) < tolerance) return "0";
            
            // 使用连分数算法找到最佳分数表示
            let sign = num < 0 ? -1 : 1;
            num = Math.abs(num);
            
            let n1 = 1, d1 = 0;
            let n2 = 0, d2 = 1;
            let b = num;
            
            do {
                let a = Math.floor(b);
                let aux = n1;
                n1 = a * n1 + n2;
                n2 = aux;
                aux = d1;
                d1 = a * d1 + d2;
                d2 = aux;
                b = 1 / (b - a);
            } while (Math.abs(num - n1 / d1) > num * tolerance && d1 < 1000000);
            
            // 如果分母过大，可能是无理数的近似值，返回null
            if (d1 > 10000) {
                return null;
            }
            
            // 如果分母为1，则返回整数
            if (d1 === 1) {
                return (sign * n1).toString();
            }
            
            return (sign < 0 ? "-" : "") + n1 + "/" + d1;
        },
        
        // 将数字表示为根号形式
        toRadical: function(num) {
            // 处理负数
            if (num < 0) {
                return "-" + this.toRadical(-num);
            }
            
            // 检查是否为完全平方数
            if (this.isPerfectSquare(num)) {
                return Math.round(Math.sqrt(num)).toString();
            }
            
            // 检查常见的无理数
            const commonRadicals = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15];
            
            for (let radical of commonRadicals) {
                const sqrtRadical = Math.sqrt(radical);
                
                // 检查是否是√radical
                if (Math.abs(num - sqrtRadical) < 1e-10) {
                    return "√" + radical;
                }
                
                // 检查是否是√radical的整数倍
                for (let i = 2; i <= 10; i++) {
                    if (Math.abs(num - i * sqrtRadical) < 1e-10) {
                        return i + "√" + radical;
                    }
                }
                
                // 检查是否是√radical的分数
                for (let i = 2; i <= 10; i++) {
                    if (Math.abs(num - sqrtRadical / i) < 1e-10) {
                        return "√" + radical + "/" + i;
                    }
                }
            }
            
            // 尝试分解为 a√b 的形式
            const decomposed = this.getMaxSquareFactor(Math.round(num * num * 1e10) / 1e10);
            
            if (decomposed.factor > 1 || decomposed.root > 1) {
                if (decomposed.factor === 1) {
                    return "√" + decomposed.root;
                } else {
                    return decomposed.factor + "√" + decomposed.root;
                }
            }
            
            // 如果无法简化，则直接返回根号形式
            // 尝试找到最接近的完全平方数
            const nearestSquare = Math.round(Math.sqrt(num)) ** 2;
            const diff = Math.abs(num - nearestSquare);
            
            if (diff < 1e-10) {
                return Math.sqrt(nearestSquare).toString();
            } else if (num > 1 && diff / num < 0.01) {
                // 如果非常接近完全平方数，可能是计算误差
                return Math.round(Math.sqrt(nearestSquare)).toString();
            }
            
            // 最后尝试：检查是否是常见无理数的近似值
            for (let i = 2; i <= 100; i++) {
                if (!this.isPerfectSquare(i)) {
                    const sqrtI = Math.sqrt(i);
                    if (Math.abs(num - sqrtI) < 1e-10) {
                        return "√" + i;
                    }
                }
            }
            
            return null;
        },
        
        // 格式化复数
        formatComplex: function(real, imag) {
            let realPart = this.formatAsRadical(real);
            let imagPart = this.formatAsRadical(Math.abs(imag));
            
            if (imag === 0) {
                return realPart;
            }
            
            if (real === 0) {
                if (imag === 1) return "i";
                if (imag === -1) return "-i";
                return imagPart + "i";
            }
            
            if (imag === 1) {
                return realPart + " + i";
            }
            
            if (imag === -1) {
                return realPart + " - i";
            }
            
            return realPart + (imag < 0 ? " - " : " + ") + imagPart + "i";
        },
        
        // 格式化二次方程的解
        formatQuadraticSolution: function(a, b, delta) {
            // 如果判别式是完全平方数，则结果是有理数
            if (this.isPerfectSquare(delta)) {
                const x1 = (-b + Math.sqrt(delta)) / (2 * a);
                const x2 = (-b - Math.sqrt(delta)) / (2 * a);
                return {
                    x1: this.formatAsRadical(x1),
                    x2: this.formatAsRadical(x2),
                    steps: [
                        `x₁ = (-b + √Δ) / (2a) = (${-b} + √${delta}) / (2 × ${a}) = ${this.formatAsRadical(x1)}`,
                        `x₂ = (-b - √Δ) / (2a) = (${-b} - √${delta}) / (2 × ${a}) = ${this.formatAsRadical(x2)}`
                    ]
                };
            }
            
            // 处理无理数解
            // 先尝试简化 -b/(2a) 部分
            const commonTerm = -b / (2 * a);
            const commonTermStr = this.formatAsRadical(commonTerm);
            
            // 简化 √delta/(2a) 部分
            let sqrtDeltaTerm = "";
            let x1Str = "", x2Str = "";
            
            // 检查是否可以简化根号部分
            const decomposed = this.getMaxSquareFactor(delta);
            
            if (decomposed.factor > 1 || decomposed.root > 1) {
                // 可以简化为 (-b ± factor√root)/(2a) 的形式
                if (decomposed.factor === 1) {
                    // 形如 (-b ± √root)/(2a)
                    if (a === 1) {
                        // 当a=1时，进一步简化
                        x1Str = `${commonTermStr} + √${decomposed.root}/2`;
                        x2Str = `${commonTermStr} - √${decomposed.root}/2`;
                    } else if (a === -1) {
                        // 当a=-1时，处理符号
                        x1Str = `${commonTermStr} - √${decomposed.root}/2`;
                        x2Str = `${commonTermStr} + √${decomposed.root}/2`;
                    } else {
                        x1Str = `${commonTermStr} + √${decomposed.root}/(2×${Math.abs(a)})`;
                        x2Str = `${commonTermStr} - √${decomposed.root}/(2×${Math.abs(a)})`;
                    }
                } else {
                    // 形如 (-b ± factor√root)/(2a)
                    if (a === 1) {
                        // 当a=1时，进一步简化
                        x1Str = `${commonTermStr} + ${decomposed.factor}√${decomposed.root}/2`;
                        x2Str = `${commonTermStr} - ${decomposed.factor}√${decomposed.root}/2`;
                    } else if (a === -1) {
                        // 当a=-1时，处理符号
                        x1Str = `${commonTermStr} - ${decomposed.factor}√${decomposed.root}/2`;
                        x2Str = `${commonTermStr} + ${decomposed.factor}√${decomposed.root}/2`;
                    } else {
                        x1Str = `${commonTermStr} + ${decomposed.factor}√${decomposed.root}/(2×${Math.abs(a)})`;
                        x2Str = `${commonTermStr} - ${decomposed.factor}√${decomposed.root}/(2×${Math.abs(a)})`;
                    }
                }
            } else {
                // 无法进一步简化，使用原始形式
                if (a === 1) {
                    x1Str = `${commonTermStr} + √${delta}/2`;
                    x2Str = `${commonTermStr} - √${delta}/2`;
                } else if (a === -1) {
                    x1Str = `${commonTermStr} - √${delta}/2`;
                    x2Str = `${commonTermStr} + √${delta}/2`;
                } else {
                    x1Str = `${commonTermStr} + √${delta}/(2×${Math.abs(a)})`;
                    x2Str = `${commonTermStr} - √${delta}/(2×${Math.abs(a)})`;
                }
            }
            
            // 构建步骤说明，确保负号显示正确
            let stepX1 = `x₁ = (-b + √Δ) / (2a) = (${-b} + √${delta}) / (2 × ${a})`;
            let stepX2 = `x₂ = (-b - √Δ) / (2a) = (${-b} - √${delta}) / (2 × ${a})`;
            
            // 处理负指数显示问题
            stepX1 = stepX1.replace(/\+-/g, "-");
            stepX2 = stepX2.replace(/\+-/g, "-");
            x1Str = x1Str.replace(/\+-/g, "-");
            x2Str = x2Str.replace(/\+-/g, "-");
            
            return {
                x1: x1Str,
                x2: x2Str,
                steps: [
                    `${stepX1} = ${x1Str}`,
                    `${stepX2} = ${x2Str}`
                ]
            };
        },
        
        // 计算最大公约数
        gcd: function(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            if (b > a) {
                [a, b] = [b, a];
            }
            while (b) {
                [a, b] = [b, a % b];
            }
            return a;
        },
        
        // 修复负号显示问题
        fixNegativeDisplay: function(str) {
            return str.replace(/\+-/g, "-").replace(/--/g, "+");
        }
    };
    
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
                const xFormatted = mathUtils.formatAsRadical(x);
                
                return {
                    type: 'single',
                    solution: { x: xFormatted },
                    steps: [
                        `原方程：${a}x + ${b} = 0`,
                        `移项：${a}x = ${-b}`,
                        `两边同除以 ${a}：x = ${-b} / ${a}`,
                        `解得：x = ${xFormatted}`
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
                    const xFormatted = mathUtils.formatAsRadical(x);
                    
                    return {
                        type: 'single',
                        solution: { x: xFormatted },
                        steps: [
                            `原方程：${b}x + ${c} = 0 (a = 0，退化为一次方程)`,
                            `移项：${b}x = ${-c}`,
                            `两边同除以 ${b}：x = ${-c} / ${b}`,
                            `解得：x = ${xFormatted}`
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
                    
                    const realFormatted = mathUtils.formatAsRadical(realPart);
                    const imagFormatted = mathUtils.formatAsRadical(imagPart);
                    
                    // 修复负号显示问题
                    const x1Formatted = mathUtils.formatComplex(realPart, imagPart);
                    const x2Formatted = mathUtils.formatComplex(realPart, -imagPart);
                    
                    steps.push(`在复数范围内，方程有两个解：`);
                    steps.push(`x₁ = ${realFormatted} + ${imagFormatted}i`);
                    steps.push(`x₂ = ${realFormatted} - ${imagFormatted}i`);
                    
                    return {
                        type: 'complex',
                        solution: {
                            x1: { real: realPart, imag: imagPart, formatted: x1Formatted },
                            x2: { real: realPart, imag: -imagPart, formatted: x2Formatted }
                        },
                        steps: steps.map(step => mathUtils.fixNegativeDisplay(step))
                    };
                } else if (delta === 0) {
                    // 唯一解
                    const x = -b / (2 * a);
                    const xFormatted = mathUtils.formatAsRadical(x);
                    
                    steps.push(`由于判别式 Δ = 0，方程有唯一解`);
                    steps.push(`x = -b / (2a) = ${-b} / (2 × ${a}) = ${xFormatted}`);
                    
                    return {
                        type: 'double',
                        solution: { x: xFormatted },
                        steps: steps.map(step => mathUtils.fixNegativeDisplay(step))
                    };
                } else {
                    // 两个不同的解
                    const solution = mathUtils.formatQuadraticSolution(a, b, delta);
                    
                    steps.push(`由于判别式 Δ > 0，方程有两个不同的解`);
                    steps.push(solution.steps[0]);
                    steps.push(solution.steps[1]);
                    
                    return {
                        type: 'two',
                        solution: { 
                            x1: solution.x1, 
                            x2: solution.x2 
                        },
                        steps: steps.map(step => mathUtils.fixNegativeDisplay(step))
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
                            steps: steps.map(step => mathUtils.fixNegativeDisplay(step))
                        };
                    } else {
                        // 两个方程不成比例，无解
                        steps.push(`由于行列式为0，且两个方程不成比例，方程组无解`);
                        
                        return {
                            type: 'none',
                            message: '方程组无解',
                            steps: steps.map(step => mathUtils.fixNegativeDisplay(step))
                        };
                    }
                } else {
                    // 行列式不为0，有唯一解
                    const x = (c * e - b * f) / det;
                    const y = (a * f - c * d) / det;
                    
                    const xFormatted = mathUtils.formatAsRadical(x);
                    const yFormatted = mathUtils.formatAsRadical(y);
                    
                    steps.push(`由于行列式不为0，方程组有唯一解`);
                    steps.push(`使用克莱默法则：`);
                    steps.push(`x = (ce - bf) / det = (${c} × ${e} - ${b} × ${f}) / ${det} = ${xFormatted}`);
                    steps.push(`y = (af - cd) / det = (${a} × ${f} - ${c} × ${d}) / ${det} = ${yFormatted}`);
                    
                    // 验证解
                    const eq1 = a * x + b * y;
                    const eq2 = d * x + e * y;
                    
                    steps.push(`验证：`);
                    steps.push(`${a} × ${xFormatted} + ${b} × ${yFormatted} = ${eq1.toFixed(10)} ≈ ${c}`);
                    steps.push(`${d} × ${xFormatted} + ${e} × ${yFormatted} = ${eq2.toFixed(10)} ≈ ${f}`);
                    
                    return {
                        type: 'unique',
                        solution: { x: xFormatted, y: yFormatted },
                        steps: steps.map(step => mathUtils.fixNegativeDisplay(step))
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
                html += `
                    <p><strong>复数解：</strong></p>
                    <p>x₁ = ${result.solution.x1.formatted}</p>
                    <p>x₂ = ${result.solution.x2.formatted}</p>
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
