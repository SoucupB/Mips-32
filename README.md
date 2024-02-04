Initially, the language will have no spaces or special unrenderableCharacters.

Constant = (-2^31, 2^31);
Variable = (char)(number)(underscore).

Expression = Constant
Expression = Variable
Expression = Constant Operator Expression
Expression = Variable Operator Expression
Expression = (Expression)

Compiling the code will transform it into temporary ASM code

```
MOV $a, $b (a -> register, b -> register)
MOV [$a + constant], $b ([a] -> memory block at register + constant, b -> register)
MOV $a, [$b + constant] (a -> register, [b] -> memory block at register + constant)

push $a (pushes value of a onto the stack)
pop $a (pops value from the stack)

push *a (pushes stack with size 'a')
pop *a (pops stack of size 'a')

jmp $a (jumps at the memory value of register $a)
jmp x (jumps at absolute value x)
```

In order to load an expression tree into normal ASM we can use

### Expression evaluation
# Simple code
```
1+3*8 (1+(3*8))
becomes

MOV $0 1
MOV $1 3
MOV $2 8
mul $3 $1 $2
add $1 $0 $3

Considering that 
int a=0;
int b=0;
1+a*b

MOV $0 1
MOV $1 [sb - 4]
MOV $2 [sb - 2]
mul $3 $1 $2
add $1 $0 $3
```
# Operations
```
a+b
add c, a, b -- c = a + b

a-b
sub c, a, b -- c = a - b

a*b
mul c, a, b -- c = a * b

a/b

// if 7 is busy with another locked value, push $7 and pop it after the instruction ends
MOV $7 a
MOV $8 b

div $8  -- $7 / $8 and results are div - $13 reminder $14

cmp $0, $1  ; Compare $1 $0
if $0 < $1
$26 <- 1 $27 <- 0 $28 <- 0
if $0 > $1
$26 <- 0 $27 <- 1 $28 <- 0
if $0 == $1
$26 <- 0 $27 <- 0 $28 <- 1
push $26, $27, $28 if needed.
```

### Initialization
```
int x=expression;

*Evaluate expression and put the result in register x

push $x // The size is evaluated with the size of the datatype
```

### Conditional


