# Hello Java

![可爱小Java](/java.png)

---

<<< Hello.java

**编译**

```
javac Hello.java
```

同目录生成了`Hello.class`文件

**运行**

```
java Hello
```

**输出**

```
你好呀，Java酱
```

---

## 打印输出
### System.out.println
打印并换行

```java
public class Println{
	public static void main(String[] args){
		System.out.println("可爱小Java");
		System.out.println("少了缩进不报错");
		System.out.println("永远爱Java");
	}
}
```

**输出**

```
可爱小Java
少了缩进不报错
永远爱Java
```

### System.out.print
仅打印，不换行

```java
public class Print{
	public static void main(String[] args){
		System.out.print("可爱小Java");
		System.out.print("少了缩进不报错");
		System.out.print("永远爱Java");
	}
}
```

**输出**

```
可爱小Java少了缩进不报错永远爱Java
```

## IO.println
在Java25中，也可以使用如下方式打印文本

```java
void main(){
	IO.println("你好呀，Java酱");
}
```