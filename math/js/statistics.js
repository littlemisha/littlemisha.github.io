// 统计分析工具功能实现
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const dataInput = document.getElementById('data-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDiv = document.getElementById('result');
    const chartContainer = document.getElementById('chart-container');
    
    // 图表对象
    let myChart = null;
    
    // 分析按钮点击事件
    analyzeBtn.addEventListener('click', function() {
        analyzeData();
    });
    
    // 清除按钮点击事件
    clearBtn.addEventListener('click', function() {
        dataInput.value = '';
        resultDiv.innerHTML = '<h3>分析结果</h3><p>请输入数据并点击分析按钮</p>';
        
        // 清除图表
        if (myChart) {
            myChart.destroy();
            myChart = null;
        }
    });
    
    // 分析数据
    function analyzeData() {
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
        const stats = calculateStatistics(numbers);
        
        // 显示结果
        displayResults(stats);
        
        // 绘制图表
        drawChart(numbers);
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
    
    // 计算统计量
    function calculateStatistics(numbers) {
        // 排序数组（用于计算中位数、四分位数等）
        const sortedNumbers = [...numbers].sort((a, b) => a - b);
        
        // 基本统计量
        const count = numbers.length;
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        const mean = sum / count;
        const min = sortedNumbers[0];
        const max = sortedNumbers[count - 1];
        const range = max - min;
        
        // 计算方差和标准差
        const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
        const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
        const variance = sumSquaredDiff / count;
        const stdDev = Math.sqrt(variance);
        
        // 计算中位数
        let median;
        if (count % 2 === 0) {
            // 偶数个数据，取中间两个的平均值
            median = (sortedNumbers[count / 2 - 1] + sortedNumbers[count / 2]) / 2;
        } else {
            // 奇数个数据，取中间值
            median = sortedNumbers[Math.floor(count / 2)];
        }
        
        // 计算四分位数
        const q1Index = Math.floor(count * 0.25);
        const q3Index = Math.floor(count * 0.75);
        const q1 = sortedNumbers[q1Index];
        const q3 = sortedNumbers[q3Index];
        const iqr = q3 - q1;
        
        // 计算众数
        const frequencyMap = {};
        let maxFrequency = 0;
        let modes = [];
        
        for (const num of numbers) {
            frequencyMap[num] = (frequencyMap[num] || 0) + 1;
            
            if (frequencyMap[num] > maxFrequency) {
                maxFrequency = frequencyMap[num];
                modes = [num];
            } else if (frequencyMap[num] === maxFrequency) {
                modes.push(num);
            }
        }
        
        // 如果所有数据出现频率相同，则没有众数
        if (modes.length === count) {
            modes = ['无众数'];
        }
        
        // 计算偏度和峰度
        let skewness = 0;
        let kurtosis = 0;
        
        if (count > 2) {
            for (const num of numbers) {
                const z = (num - mean) / stdDev;
                skewness += Math.pow(z, 3);
                kurtosis += Math.pow(z, 4);
            }
            
            skewness = skewness / count;
            kurtosis = kurtosis / count - 3; // 减去3使得正态分布的峰度为0
        }
        
        return {
            count,
            sum,
            mean,
            median,
            modes,
            min,
            max,
            range,
            variance,
            stdDev,
            q1,
            q3,
            iqr,
            skewness,
            kurtosis
        };
    }
    
    // 显示结果
    function displayResults(stats) {
        let html = `
            <h3>分析结果</h3>
            <p><strong>数据个数：</strong>${stats.count}</p>
            <p><strong>总和：</strong>${stats.sum.toFixed(4)}</p>
            <p><strong>平均值：</strong>${stats.mean.toFixed(4)}</p>
            <p><strong>中位数：</strong>${stats.median.toFixed(4)}</p>
            <p><strong>众数：</strong>${Array.isArray(stats.modes) ? stats.modes.map(m => typeof m === 'number' ? m.toFixed(4) : m).join(', ') : stats.modes}</p>
            <p><strong>最小值：</strong>${stats.min.toFixed(4)}</p>
            <p><strong>最大值：</strong>${stats.max.toFixed(4)}</p>
            <p><strong>范围：</strong>${stats.range.toFixed(4)}</p>
            <p><strong>方差：</strong>${stats.variance.toFixed(4)}</p>
            <p><strong>标准差：</strong>${stats.stdDev.toFixed(4)}</p>
            <p><strong>第一四分位数 (Q1)：</strong>${stats.q1.toFixed(4)}</p>
            <p><strong>第三四分位数 (Q3)：</strong>${stats.q3.toFixed(4)}</p>
            <p><strong>四分位距 (IQR)：</strong>${stats.iqr.toFixed(4)}</p>
            <p><strong>偏度：</strong>${stats.skewness.toFixed(4)}</p>
            <p><strong>峰度：</strong>${stats.kurtosis.toFixed(4)}</p>
        `;
        
        resultDiv.innerHTML = html;
    }
    
    // 绘制图表
    function drawChart(numbers) {
        // 清除旧图表
        if (myChart) {
            myChart.destroy();
        }
        
        // 创建画布
        chartContainer.innerHTML = '<canvas id="data-chart"></canvas>';
        const ctx = document.getElementById('data-chart').getContext('2d');
        
        // 计算直方图数据
        const binCount = Math.min(Math.ceil(Math.sqrt(numbers.length)), 15); // 根据数据量确定箱数，最多15个
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        const binWidth = (max - min) / binCount;
        
        const bins = Array(binCount).fill(0);
        const binLabels = [];
        
        // 创建箱标签
        for (let i = 0; i < binCount; i++) {
            const binStart = min + i * binWidth;
            const binEnd = binStart + binWidth;
            binLabels.push(`${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`);
        }
        
        // 填充箱
        for (const num of numbers) {
            // 处理最大值的特殊情况
            if (num === max) {
                bins[binCount - 1]++;
            } else {
                const binIndex = Math.floor((num - min) / binWidth);
                bins[binIndex]++;
            }
        }
        
        // 创建图表
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [{
                    label: '频率',
                    data: bins,
                    backgroundColor: 'rgba(74, 144, 226, 0.7)',
                    borderColor: 'rgba(74, 144, 226, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '频率'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '数值范围'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '数据分布直方图'
                    }
                }
            }
        });
    }
    
    // 显示错误信息
    function showError(message) {
        resultDiv.innerHTML = `
            <h3>分析结果</h3>
            <p class="error">${message}</p>
        `;
        
        // 清除图表
        if (myChart) {
            myChart.destroy();
            myChart = null;
        }
    }
});
