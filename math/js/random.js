// 随机数生成器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const minValueInput = document.getElementById('min-value');
    const maxValueInput = document.getElementById('max-value');
    const decimalPlacesInput = document.getElementById('decimal-places');
    const countInput = document.getElementById('count');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDiv = document.getElementById('result');
    
    // 生成按钮点击事件
    generateBtn.addEventListener('click', function() {
        generateRandomNumbers();
    });
    
    // 清除按钮点击事件
    clearBtn.addEventListener('click', function() {
        minValueInput.value = '1';
        maxValueInput.value = '100';
        decimalPlacesInput.value = '0';
        countInput.value = '1';
        resultDiv.innerHTML = '<h3>生成结果</h3><p>请设置参数并点击生成按钮</p>';
    });
    
    // 生成随机数
    function generateRandomNumbers() {
        // 获取输入参数
        const minValue = parseFloat(minValueInput.value);
        const maxValue = parseFloat(maxValueInput.value);
        const decimalPlaces = parseInt(decimalPlacesInput.value);
        const count = parseInt(countInput.value);
        
        // 验证输入
        if (isNaN(minValue) || isNaN(maxValue) || isNaN(decimalPlaces) || isNaN(count)) {
            showError('请输入有效的数值');
            return;
        }
        
        if (minValue >= maxValue) {
            showError('最小值必须小于最大值');
            return;
        }
        
        if (decimalPlaces < 0 || decimalPlaces > 10) {
            showError('小数位数必须在0到10之间');
            return;
        }
        
        if (count < 1 || count > 100) {
            showError('生成数量必须在1到100之间');
            return;
        }
        
        // 生成随机数
        const randomNumbers = [];
        for (let i = 0; i < count; i++) {
            const randomValue = generateRandomNumber(minValue, maxValue, decimalPlaces);
            randomNumbers.push(randomValue);
        }
        
        // 显示结果
        displayResults(randomNumbers);
    }
    
    // 生成指定范围和小数位数的随机数
    function generateRandomNumber(min, max, decimalPlaces) {
        const randomValue = Math.random() * (max - min) + min;
        return Number(randomValue.toFixed(decimalPlaces));
    }
    
    // 显示结果
    function displayResults(numbers) {
        let html = '<h3>生成结果</h3>';
        
        if (numbers.length === 1) {
            html += `<p class="random-result">${numbers[0]}</p>`;
        } else {
            html += '<p><strong>生成的随机数：</strong></p>';
            html += '<div class="random-list">';
            
            for (let i = 0; i < numbers.length; i++) {
                html += `<p>${i + 1}. ${numbers[i]}</p>`;
            }
            
            html += '</div>';
            
            // 添加复制按钮
            html += '<button class="btn" id="copy-btn" style="margin-top: 10px; background-color: #4a90e2;">复制所有结果</button>';
        }
        
        resultDiv.innerHTML = html;
        
        // 添加复制功能
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const textToCopy = numbers.join(', ');
                navigator.clipboard.writeText(textToCopy).then(function() {
                    alert('已复制到剪贴板');
                }).catch(function(err) {
                    console.error('无法复制: ', err);
                });
            });
        }
    }
    
    // 显示错误信息
    function showError(message) {
        resultDiv.innerHTML = `
            <h3>生成结果</h3>
            <p class="error">${message}</p>
        `;
    }
});
