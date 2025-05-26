// 方差计算器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const dataInput = document.getElementById('data-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDiv = document.getElementById('result');
    
    // 计算按钮点击事件
    calculateBtn.addEventListener('click', function() {
        calculateStatistics();
    });
    
    // 清除按钮点击事件
    clearBtn.addEventListener('click', function() {
        dataInput.value = '';
        resultDiv.innerHTML = '<h3>计算结果</h3><p>请输入数据并点击计算按钮</p>';
    });
    
    // 计算统计数据
    function calculateStatistics() {
        // 获取输入数据
        const inputText = dataInput.value.trim();
        
        if (!inputText) {
            showError('请输入数据');
            return;
        }
        
        // 解析输入数据
        const numbers = parseInputData(inputText);
        
        if (numbers.length === 0) {
            showError('无法解析输入数据，请检查格式');
            return;
        }
        
        // 计算统计量
        const count = numbers.length;
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        const mean = sum / count;
        
        // 计算方差
        const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
        const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
        const variance = sumSquaredDiff / count;
        
        // 计算样本方差（n-1）
        const sampleVariance = count > 1 ? sumSquaredDiff / (count - 1) : 0;
        
        // 计算标准差
        const stdDev = Math.sqrt(variance);
        const sampleStdDev = Math.sqrt(sampleVariance);
        
        // 计算最大值、最小值和范围
        const max = Math.max(...numbers);
        const min = Math.min(...numbers);
        const range = max - min;
        
        // 显示结果
        displayResults({
            count,
            sum,
            mean,
            variance,
            sampleVariance,
            stdDev,
            sampleStdDev,
            max,
            min,
            range
        });
    }
    
    // 解析输入数据
    function parseInputData(inputText) {
        // 尝试多种分隔符：空格、逗号、换行、分号
        let numbers = [];
        
        // 首先尝试按换行分割
        let lines = inputText.split(/\n/);
        
        if (lines.length > 1) {
            // 每行可能是一个数字
            numbers = lines
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => parseFloat(line))
                .filter(num => !isNaN(num));
        } else {
            // 尝试按逗号分割
            let commaValues = inputText.split(/,/);
            
            if (commaValues.length > 1) {
                numbers = commaValues
                    .map(val => val.trim())
                    .filter(val => val.length > 0)
                    .map(val => parseFloat(val))
                    .filter(num => !isNaN(num));
            } else {
                // 尝试按空格分割
                let spaceValues = inputText.split(/\s+/);
                
                if (spaceValues.length > 0) {
                    numbers = spaceValues
                        .map(val => val.trim())
                        .filter(val => val.length > 0)
                        .map(val => parseFloat(val))
                        .filter(num => !isNaN(num));
                }
            }
        }
        
        return numbers;
    }
    
    // 显示结果
    function displayResults(stats) {
        let html = `
            <h3>计算结果</h3>
            <p><strong>数据个数：</strong>${stats.count}</p>
            <p><strong>总和：</strong>${stats.sum.toFixed(4)}</p>
            <p><strong>平均值：</strong>${stats.mean.toFixed(4)}</p>
            <p><strong>总体方差：</strong>${stats.variance.toFixed(4)}</p>
            <p><strong>样本方差：</strong>${stats.sampleVariance.toFixed(4)}</p>
            <p><strong>总体标准差：</strong>${stats.stdDev.toFixed(4)}</p>
            <p><strong>样本标准差：</strong>${stats.sampleStdDev.toFixed(4)}</p>
            <p><strong>最大值：</strong>${stats.max.toFixed(4)}</p>
            <p><strong>最小值：</strong>${stats.min.toFixed(4)}</p>
            <p><strong>范围：</strong>${stats.range.toFixed(4)}</p>
        `;
        
        resultDiv.innerHTML = html;
    }
    
    // 显示错误信息
    function showError(message) {
        resultDiv.innerHTML = `
            <h3>计算结果</h3>
            <p class="error">${message}</p>
        `;
    }
});
