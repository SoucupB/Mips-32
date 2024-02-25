JMP _main
:_getElement
MOV $0 [$st-8]
MOV $1 4
MUL $2 $0 $1
PUSH $2
MOV $0 [$st-16]
MOV $1 [$st-4]
ADD $2 $0 $1
POP 4
MOV $0 [$2]
MOV $ret [$st-4]
MOV $rsp $0
JMP $ret
:_setElement
MOV $0 [$st-8]
PUSH $0
MOV $0 [$st-16]
MOV $1 4
MUL $2 $0 $1
PUSH $2
MOV $0 [$st-24]
MOV $1 [$st-4]
ADD $2 $0 $1
POP 4
PUSH $2
MOV $1 [$st-4]
MOV $0 [$st-8]
MOV [$1] $0
POP 8
MOV $0 0
MOV $ret [$st-4]
MOV $rsp $0
JMP $ret
:_printLine
MOV $0 65536
PUSH $0
MOV $0 [$st-4]
MOV $1 4
SUB $2 $0 $1
MOV $0 [$2]
PUSH $0
MOV $0 [$st-16]
PUSH $0
MOV $0 [$st-12]
MOV $1 [$st-8]
ADD $2 $0 $1
PUSH $2
MOV $1 [$st-4]
MOV $0 [$st-8]
MOV [$1] $0
POP 8
MOV $0 [$st-4]
MOV $1 4
ADD $2 $0 $1
PUSH $2
MOV $0 [$st-12]
MOV $1 4
SUB $2 $0 $1
PUSH $2
MOV $1 [$st-4]
MOV $0 [$st-8]
MOV [$1] $0
POP 8
MOV $0 0
MOV $ret [$st-12]
MOV $rsp $0
POP 8
JMP $ret
:_getElementInMatrix
MOV $1 [$st-20]
PUSH $1
MOV $1 [$st-20]
MOV $2 [$st-12]
MUL $3 $1 $2
PUSH $3
MOV $1 [$st-4]
MOV $2 [$st-20]
ADD $3 $1 $2
POP 4
PUSH $3
PRP $ret 3
PUSH $ret
JMP _getElement
POP 12
PUSH $rsp
MOV $0 $rsp
POP 4
MOV $ret [$st-4]
MOV $rsp $0
JMP $ret
:_setElementInMatrix
MOV $1 [$st-24]
PUSH $1
MOV $1 [$st-24]
MOV $2 [$st-16]
MUL $3 $1 $2
PUSH $3
MOV $1 [$st-4]
MOV $2 [$st-24]
ADD $3 $1 $2
POP 4
PUSH $3
MOV $1 [$st-16]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _setElement
POP 16
PUSH $rsp
MOV $0 $rsp
POP 4
MOV $ret [$st-4]
MOV $rsp $0
JMP $ret
:_getLineResult
MOV $1 [$st-16]
PUSH $1
MOV $1 [$st-16]
PUSH $1
MOV $1 0
PUSH $1
MOV $1 [$st-20]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-20]
PUSH $0
MOV $0 [$st-20]
PUSH $0
MOV $0 1
PUSH $0
MOV $0 [$st-24]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $1 [$st-8]
MOV $0 [$st-4]
CMP $1 $0
SETE $0
PUSH $0
MOV $0 [$st-28]
PUSH $0
MOV $0 [$st-28]
PUSH $0
MOV $0 2
PUSH $0
MOV $0 [$st-32]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $1 [$st-16]
MOV $0 [$st-4]
CMP $1 $0
SETE $0
PUSH $0
MOV $0 [$st-12]
MOV $1 [$st-4]
CMP $0 $1
SETNZ $0
POP 16
TEST $0 $0
JZ _label0
MOV $0 [$st-4]
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_label0
MOV $0 0
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_getColumnResult
MOV $1 [$st-16]
PUSH $1
MOV $1 0
PUSH $1
MOV $1 [$st-20]
PUSH $1
MOV $1 [$st-20]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-20]
PUSH $0
MOV $0 1
PUSH $0
MOV $0 [$st-24]
PUSH $0
MOV $0 [$st-24]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $1 [$st-8]
MOV $0 [$st-4]
CMP $1 $0
SETE $0
PUSH $0
MOV $0 [$st-28]
PUSH $0
MOV $0 2
PUSH $0
MOV $0 [$st-32]
PUSH $0
MOV $0 [$st-32]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $1 [$st-16]
MOV $0 [$st-4]
CMP $1 $0
SETE $0
PUSH $0
MOV $0 [$st-12]
MOV $1 [$st-4]
CMP $0 $1
SETNZ $0
POP 16
TEST $0 $0
JZ _label1
MOV $0 [$st-4]
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_label1
MOV $0 0
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_getLinesResponse
:_startForLoop2
MOV $0 0
PUSH $0
:_label3
MOV $0 [$st-4]
MOV $1 3
CMP $0 $1
MOV $0 $CF
TEST $0 $0
JZ _label4
MOV $1 [$st-16]
PUSH $1
MOV $1 [$st-8]
PUSH $1
MOV $1 [$st-20]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _getLineResult
POP 16
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-4]
TEST $0 $0
JZ _label5
MOV $0 [$st-4]
MOV $ret [$st-12]
MOV $rsp $0
POP 8
JMP $ret
:_label5
POP 4
MOV $0 [$st-4]
MOV $1 1
ADD $2 $0 $1
MOV [$st-4] $2
JMP _label3
:_label4
POP 4
MOV $0 0
MOV $ret [$st-4]
MOV $rsp $0
JMP $ret
:_getColumnResponse
:_startForLoop6
MOV $0 0
PUSH $0
:_label7
MOV $0 [$st-4]
MOV $1 3
CMP $0 $1
MOV $0 $CF
TEST $0 $0
JZ _label8
MOV $1 [$st-16]
PUSH $1
MOV $1 [$st-8]
PUSH $1
MOV $1 [$st-20]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _getColumnResult
POP 16
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-4]
TEST $0 $0
JZ _label9
MOV $0 [$st-4]
MOV $ret [$st-12]
MOV $rsp $0
POP 8
JMP $ret
:_label9
POP 4
MOV $0 [$st-4]
MOV $1 1
ADD $2 $0 $1
MOV [$st-4] $2
JMP _label7
:_label8
POP 4
MOV $0 0
MOV $ret [$st-4]
MOV $rsp $0
JMP $ret
:_diag
MOV $1 [$st-12]
PUSH $1
MOV $1 0
PUSH $1
MOV $1 0
PUSH $1
MOV $1 [$st-20]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-16]
PUSH $0
MOV $0 1
PUSH $0
MOV $0 1
PUSH $0
MOV $0 [$st-24]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $1 [$st-8]
MOV $0 [$st-4]
CMP $1 $0
SETE $0
PUSH $0
MOV $0 [$st-24]
PUSH $0
MOV $0 2
PUSH $0
MOV $0 2
PUSH $0
MOV $0 [$st-32]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $1 [$st-16]
MOV $0 [$st-4]
CMP $1 $0
SETE $0
PUSH $0
MOV $0 [$st-12]
MOV $1 [$st-4]
CMP $0 $1
SETNZ $0
POP 16
TEST $0 $0
JZ _label10
MOV $0 [$st-4]
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_label10
MOV $1 [$st-16]
PUSH $1
MOV $1 0
PUSH $1
MOV $1 2
PUSH $1
MOV $1 [$st-24]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $0 $rsp
POP 4
MOV [$st-4] $0
MOV $0 [$st-16]
PUSH $0
MOV $0 1
PUSH $0
MOV $0 1
PUSH $0
MOV $0 [$st-24]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $1 [$st-8]
MOV $0 [$st-4]
CMP $1 $0
SETE $0
PUSH $0
MOV $0 [$st-24]
PUSH $0
MOV $0 2
PUSH $0
MOV $0 0
PUSH $0
MOV $0 [$st-32]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $1 [$st-16]
MOV $0 [$st-4]
CMP $1 $0
SETE $0
PUSH $0
MOV $0 [$st-12]
MOV $1 [$st-4]
CMP $0 $1
SETNZ $0
POP 16
TEST $0 $0
JZ _label11
MOV $0 [$st-4]
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_label11
MOV $0 0
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_isDraw
:_startForLoop12
MOV $0 0
PUSH $0
:_label13
MOV $0 [$st-4]
MOV $1 3
CMP $0 $1
MOV $0 $CF
TEST $0 $0
JZ _label14
:_startForLoop15
MOV $0 0
PUSH $0
:_label16
MOV $0 [$st-4]
MOV $1 3
CMP $0 $1
MOV $0 $CF
TEST $0 $0
JZ _label17
MOV $0 [$st-16]
PUSH $0
MOV $0 [$st-12]
PUSH $0
MOV $0 [$st-12]
PUSH $0
MOV $0 3
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $0 [$st-4]
MOV $1 0
CMP $0 $1
SETE $0
POP 4
TEST $0 $0
JZ _label18
MOV $0 0
MOV $ret [$st-12]
MOV $rsp $0
POP 8
JMP $ret
:_label18
MOV $0 [$st-4]
MOV $1 1
ADD $2 $0 $1
MOV [$st-4] $2
JMP _label16
:_label17
POP 4
MOV $0 [$st-4]
MOV $1 1
ADD $2 $0 $1
MOV [$st-4] $2
JMP _label13
:_label14
POP 4
MOV $0 1
MOV $ret [$st-4]
MOV $rsp $0
JMP $ret
:_resultMethod
MOV $1 [$st-12]
PUSH $1
MOV $1 [$st-12]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _getColumnResponse
POP 12
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-4]
MOV $1 0
CMP $0 $1
SETNE $0
TEST $0 $0
JZ _label19
MOV $0 [$st-4]
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_label19
MOV $1 [$st-16]
PUSH $1
MOV $1 [$st-16]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _getLinesResponse
POP 12
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-4]
MOV $1 0
CMP $0 $1
SETNE $0
TEST $0 $0
JZ _label20
MOV $0 [$st-4]
MOV $ret [$st-12]
MOV $rsp $0
POP 8
JMP $ret
:_label20
MOV $1 [$st-20]
PUSH $1
MOV $1 [$st-20]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _diag
POP 12
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-4]
MOV $1 0
CMP $0 $1
SETNE $0
TEST $0 $0
JZ _label21
MOV $0 [$st-4]
MOV $ret [$st-16]
MOV $rsp $0
POP 12
JMP $ret
:_label21
MOV $1 [$st-24]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _isDraw
POP 8
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-4]
MOV $1 0
CMP $0 $1
SETNE $0
TEST $0 $0
JZ _label22
MOV $0 3
MOV $ret [$st-20]
MOV $rsp $0
POP 16
JMP $ret
:_label22
MOV $0 0
MOV $ret [$st-20]
MOV $rsp $0
POP 16
JMP $ret
:_aiMove
MOV $1 [$st-28]
PUSH $1
MOV $1 [$st-24]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _resultMethod
POP 12
PUSH $rsp
MOV $0 $rsp
POP 4
PUSH $0
MOV $0 [$st-4]
MOV $1 [$st-28]
CMP $0 $1
SETE $0
TEST $0 $0
JZ _label23
MOV $0 50
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_label23
MOV $0 3
MOV $1 [$st-28]
SUB $2 $0 $1
PUSH $2
MOV $0 [$st-8]
MOV $1 [$st-4]
CMP $0 $1
SETE $0
POP 4
TEST $0 $0
JZ _label24
MOV $0 0
MOV $1 50
SUB $2 $0 $1
MOV $ret [$st-8]
MOV $rsp $2
POP 4
JMP $ret
:_label24
MOV $0 [$st-4]
MOV $1 3
CMP $0 $1
SETE $0
TEST $0 $0
JZ _label25
MOV $0 20
MOV $ret [$st-8]
MOV $rsp $0
POP 4
JMP $ret
:_label25
MOV $0 0
MOV $1 100
SUB $2 $0 $1
PUSH $2
:_startForLoop26
MOV $0 0
PUSH $0
:_label27
MOV $0 [$st-4]
MOV $1 3
CMP $0 $1
MOV $0 $CF
TEST $0 $0
JZ _label28
:_startForLoop29
MOV $0 0
PUSH $0
:_label30
MOV $0 [$st-4]
MOV $1 3
CMP $0 $1
MOV $0 $CF
TEST $0 $0
JZ _label31
MOV $0 [$st-44]
PUSH $0
MOV $0 [$st-12]
PUSH $0
MOV $0 [$st-12]
PUSH $0
MOV $0 [$st-48]
PUSH $0
PRP $ret 3
PUSH $ret
JMP _getElementInMatrix
POP 20
PUSH $rsp
MOV $0 [$st-4]
MOV $1 0
CMP $0 $1
SETE $0
POP 4
TEST $0 $0
JZ _label32
MOV $1 [$st-44]
PUSH $1
MOV $1 [$st-12]
PUSH $1
MOV $1 [$st-12]
PUSH $1
MOV $1 3
PUSH $1
MOV $1 [$st-56]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _setElementInMatrix
POP 24
PUSH $rsp
MOV $0 $rsp
POP 4
MOV $0 [$st-44]
PUSH $0
MOV $0 3
MOV $1 [$st-44]
SUB $2 $0 $1
PUSH $2
MOV $0 [$st-44]
PUSH $0
MOV $0 [$st-44]
PUSH $0
MOV $0 [$st-44]
PUSH $0
MOV $0 [$st-44]
MOV $1 1
ADD $2 $0 $1
PUSH $2
PRP $ret 3
PUSH $ret
JMP _aiMove
POP 28
PUSH $rsp
MOV $1 0
MOV $0 [$st-4]
SUB $2 $1 $0
POP 4
PUSH $2
MOV $0 [$st-4]
MOV $1 20
CMP $0 $1
SETE $0
PUSH $0
MOV $0 0
MOV $1 20
SUB $2 $0 $1
PUSH $2
MOV $0 [$st-12]
MOV $1 [$st-4]
CMP $0 $1
SETE $0
PUSH $0
MOV $0 [$st-12]
MOV $1 [$st-4]
OR $0 $1
SETDOR $2
POP 12
TEST $2 $2
JZ _label33
MOV $0 20
MOV [$st-4] $0
:_label33
MOV $1 [$st-48]
PUSH $1
MOV $1 [$st-16]
PUSH $1
MOV $1 [$st-16]
PUSH $1
MOV $1 3
PUSH $1
MOV $1 0
PUSH $1
PRP $ret 3
PUSH $ret
JMP _setElementInMatrix
POP 24
PUSH $rsp
MOV $0 $rsp
POP 4
MOV $0 [$st-4]
MOV $1 [$st-16]
CMP $0 $1
MOV $0 $CT
TEST $0 $0
JZ _label34
MOV $0 [$st-4]
MOV [$st-16] $0
MOV $0 [$st-28]
MOV $1 0
CMP $0 $1
SETE $0
TEST $0 $0
JZ _label35
MOV $0 [$st-8]
PUSH $0
MOV $0 [$st-40]
PUSH $0
MOV $1 [$st-4]
MOV $0 [$st-8]
MOV [$1] $0
POP 8
MOV $0 [$st-12]
PUSH $0
MOV $0 [$st-36]
PUSH $0
MOV $1 [$st-4]
MOV $0 [$st-8]
MOV [$1] $0
POP 8
:_label35
:_label34
POP 4
:_label32
MOV $0 [$st-4]
MOV $1 1
ADD $2 $0 $1
MOV [$st-4] $2
JMP _label30
:_label31
POP 4
MOV $0 [$st-4]
MOV $1 1
ADD $2 $0 $1
MOV [$st-4] $2
JMP _label27
:_label28
POP 4
MOV $0 [$st-4]
MOV $ret [$st-12]
MOV $rsp $0
POP 8
JMP $ret
:_main
MOV $0 3000
PUSH $0
MOV $0 5000
PUSH $0
MOV $0 5200
PUSH $0
MOV $1 [$st-12]
PUSH $1
MOV $1 0
PUSH $1
MOV $1 0
PUSH $1
MOV $1 3
PUSH $1
MOV $1 1
PUSH $1
PRP $ret 3
PUSH $ret
JMP _setElementInMatrix
POP 24
PUSH $rsp
MOV $0 $rsp
POP 4
MOV $2 [$st-12]
PUSH $2
MOV $2 2
PUSH $2
MOV $2 3
PUSH $2
MOV $2 [$st-20]
PUSH $2
MOV $2 [$st-20]
PUSH $2
MOV $2 0
PUSH $2
PRP $ret 3
PUSH $ret
JMP _aiMove
POP 28
PUSH $rsp
MOV $1 $rsp
POP 4
PUSH $1
PRP $ret 3
PUSH $ret
JMP _printLine
POP 8
PUSH $rsp
MOV $0 $rsp
POP 4
MOV $1 [$st-8]
MOV $1 [$1]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _printLine
POP 8
PUSH $rsp
MOV $0 $rsp
POP 4
MOV $1 [$st-4]
MOV $1 [$1]
PUSH $1
PRP $ret 3
PUSH $ret
JMP _printLine
POP 8
PUSH $rsp
MOV $0 $rsp
POP 16