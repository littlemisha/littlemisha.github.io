// 单位转换器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const unitTypeSelect = document.getElementById('unit-type');
    const inputValueInput = document.getElementById('input-value');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.getElementById('swap-btn');
    const resultDiv = document.getElementById('result');
    
    // 单位定义
    const unitDefinitions = {
        length: {
            name: '长度',
            units: {
                mm: { name: '毫米 (mm)', factor: 0.001 },
                cm: { name: '厘米 (cm)', factor: 0.01 },
                dm: { name: '分米 (dm)', factor: 0.1 },
                m: { name: '米 (m)', factor: 1 },
                km: { name: '千米 (km)', factor: 1000 },
                inch: { name: '英寸 (in)', factor: 0.0254 },
                foot: { name: '英尺 (ft)', factor: 0.3048 },
                yard: { name: '码 (yd)', factor: 0.9144 },
                mile: { name: '英里 (mi)', factor: 1609.344 }
            }
        },
        weight: {
            name: '重量',
            units: {
                mg: { name: '毫克 (mg)', factor: 0.000001 },
                g: { name: '克 (g)', factor: 0.001 },
                kg: { name: '千克 (kg)', factor: 1 },
                t: { name: '吨 (t)', factor: 1000 },
                oz: { name: '盎司 (oz)', factor: 0.0283495 },
                lb: { name: '磅 (lb)', factor: 0.453592 },
                stone: { name: '英石 (st)', factor: 6.35029 }
            }
        },
        area: {
            name: '面积',
            units: {
                mm2: { name: '平方毫米 (mm²)', factor: 0.000001 },
                cm2: { name: '平方厘米 (cm²)', factor: 0.0001 },
                dm2: { name: '平方分米 (dm²)', factor: 0.01 },
                m2: { name: '平方米 (m²)', factor: 1 },
                a: { name: '公亩 (a)', factor: 100 },
                ha: { name: '公顷 (ha)', factor: 10000 },
                km2: { name: '平方千米 (km²)', factor: 1000000 },
                in2: { name: '平方英寸 (in²)', factor: 0.00064516 },
                ft2: { name: '平方英尺 (ft²)', factor: 0.092903 },
                yd2: { name: '平方码 (yd²)', factor: 0.836127 },
                acre: { name: '英亩 (acre)', factor: 4046.86 },
                mi2: { name: '平方英里 (mi²)', factor: 2589988.11 }
            }
        },
        volume: {
            name: '体积',
            units: {
                ml: { name: '毫升 (ml)', factor: 0.001 },
                cl: { name: '厘升 (cl)', factor: 0.01 },
                dl: { name: '分升 (dl)', factor: 0.1 },
                l: { name: '升 (l)', factor: 1 },
                m3: { name: '立方米 (m³)', factor: 1000 },
                in3: { name: '立方英寸 (in³)', factor: 0.0163871 },
                ft3: { name: '立方英尺 (ft³)', factor: 28.3168 },
                yd3: { name: '立方码 (yd³)', factor: 764.555 },
                gal_us: { name: '美制加仑 (gal)', factor: 3.78541 },
                gal_uk: { name: '英制加仑 (gal)', factor: 4.54609 }
            }
        },
        temperature: {
            name: '温度',
            units: {
                c: { name: '摄氏度 (°C)', factor: 1 },
                f: { name: '华氏度 (°F)', factor: 1 },
                k: { name: '开尔文 (K)', factor: 1 }
            }
        },
        time: {
            name: '时间',
            units: {
                ms: { name: '毫秒 (ms)', factor: 0.001 },
                s: { name: '秒 (s)', factor: 1 },
                min: { name: '分钟 (min)', factor: 60 },
                h: { name: '小时 (h)', factor: 3600 },
                day: { name: '天 (day)', factor: 86400 },
                week: { name: '周 (week)', factor: 604800 },
                month: { name: '月 (30天)', factor: 2592000 },
                year: { name: '年 (365天)', factor: 31536000 }
            }
        }
    };
    
    // 初始化单位类型选择
    unitTypeSelect.addEventListener('change', function() {
        updateUnitSelects();
    });
    
    // 转换按钮点击事件
    convertBtn.addEventListener('click', function() {
        convertUnits();
    });
    
    // 交换单位按钮点击事件
    swapBtn.addEventListener('click', function() {
        const fromIndex = fromUnitSelect.selectedIndex;
        fromUnitSelect.selectedIndex = toUnitSelect.selectedIndex;
        toUnitSelect.selectedIndex = fromIndex;
        convertUnits();
    });
    
    // 输入值变化时自动转换
    inputValueInput.addEventListener('input', function() {
        convertUnits();
    });
    
    // 单位选择变化时自动转换
    fromUnitSelect.addEventListener('change', function() {
        convertUnits();
    });
    
    toUnitSelect.addEventListener('change', function() {
        convertUnits();
    });
    
    // 更新单位选择下拉列表
    function updateUnitSelects() {
        const unitType = unitTypeSelect.value;
        const units = unitDefinitions[unitType].units;
        
        // 清空现有选项
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        
        // 添加新选项
        for (const [code, unit] of Object.entries(units)) {
            const fromOption = document.createElement('option');
            fromOption.value = code;
            fromOption.textContent = unit.name;
            fromUnitSelect.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = code;
            toOption.textContent = unit.name;
            toUnitSelect.appendChild(toOption);
        }
        
        // 默认选择第一个和第二个选项
        if (fromUnitSelect.options.length > 0) {
            fromUnitSelect.selectedIndex = 0;
        }
        
        if (toUnitSelect.options.length > 1) {
            toUnitSelect.selectedIndex = 1;
        }
        
        // 自动转换
        convertUnits();
    }
    
    // 转换单位
    function convertUnits() {
        const unitType = unitTypeSelect.value;
        const inputValue = parseFloat(inputValueInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        
        if (isNaN(inputValue)) {
            showError('请输入有效的数值');
            return;
        }
        
        let result;
        
        // 温度需要特殊处理
        if (unitType === 'temperature') {
            result = convertTemperature(inputValue, fromUnit, toUnit);
        } else {
            // 其他单位使用因子转换
            const fromFactor = unitDefinitions[unitType].units[fromUnit].factor;
            const toFactor = unitDefinitions[unitType].units[toUnit].factor;
            result = (inputValue * fromFactor) / toFactor;
        }
        
        // 显示结果
        displayResult(inputValue, fromUnit, toUnit, result);
    }
    
    // 温度转换特殊处理
    function convertTemperature(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) {
            return value;
        }
        
        // 先转换为摄氏度
        let celsius;
        if (fromUnit === 'c') {
            celsius = value;
        } else if (fromUnit === 'f') {
            celsius = (value - 32) * 5/9;
        } else if (fromUnit === 'k') {
            celsius = value - 273.15;
        }
        
        // 从摄氏度转换为目标单位
        if (toUnit === 'c') {
            return celsius;
        } else if (toUnit === 'f') {
            return celsius * 9/5 + 32;
        } else if (toUnit === 'k') {
            return celsius + 273.15;
        }
    }
    
    // 显示结果
    function displayResult(inputValue, fromUnit, toUnit, result) {
        const unitType = unitTypeSelect.value;
        const fromUnitName = unitDefinitions[unitType].units[fromUnit].name;
        const toUnitName = unitDefinitions[unitType].units[toUnit].name;
        
        let formattedResult;
        if (Math.abs(result) < 0.000001 || Math.abs(result) > 1000000) {
            formattedResult = result.toExponential(6);
        } else {
            formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
        }
        
        const html = `
            <h3>转换结果</h3>
            <p class="conversion-result">
                ${inputValue} ${fromUnitName} = ${formattedResult} ${toUnitName}
            </p>
        `;
        
        resultDiv.innerHTML = html;
    }
    
    // 显示错误信息
    function showError(message) {
        resultDiv.innerHTML = `
            <h3>转换结果</h3>
            <p class="error">${message}</p>
        `;
    }
    
    // 初始化页面
    updateUnitSelects();
});
