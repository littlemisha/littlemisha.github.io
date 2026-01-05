# 运算符
变量的值可以使用运算符进行修改
## 算术运算符
根据[Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)，算术运算符左右应有空格

|符号|名称|
|:---:|:---:|
|+|加法|
|-|减法|
|*|乘法|
|/ |除法|
|%|取模|
|++|自增|
|--|自减|

### 示例
```java
public class Operator {
  public static void main(String[] args) {
    int a = 1;
    int b = 2;
    int c = 5;
    int d = 7;

    System.out.println("a + b = " + (a + b));
    System.out.println("a - b = " + (a - b));
    System.out.println("a * b = " + (a * b));
    System.out.println("c / b = " + (c / b));
    System.out.println("c % b = " + (c % b));
    System.out.println("c % c = " + (c % c));
    System.out.println("a++ = " + (a++));
    System.out.println("a-- = " + (a--));
    System.out.println("d++ = " + (d++));
    System.out.println("++d = " + (++d));
  }
}
```

### 输出
```
a + b = 3
a - b = -1
a * b = 2
c / b = 2
c % b = 1
c % c = 0
a++ = 1
a-- = 2
d++ = 7
++d = 9
```

## 关系运算符

| 运算符 | 名称   | a=3,b=4 | x=5,y=5 |
| :-: | :--- | :-----: | :-----: |
|  >  | 大于   |    假    |    假    |
| >=  | 大于等于 |    假    |    真    |
| ==  | 等于   |    假    |    真    |
| <=  | 小于等于 |    真    |    真    |
|  <  | 小于   |    真    |    假    |
| !=  | 不等于  |    真    |    假    |

## 逻辑运算符

| 优先级 | 运算符  | 名称  | ture,ture |
| :-: | :--: | :-: | :-------: |
|  1  |  !   | 逻辑非 |     假     |
|  2  |  &&  | 逻辑与 |     真     |
|  3  | \|\| | 逻辑或 |     真     |
