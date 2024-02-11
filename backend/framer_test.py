from framer import Framer

fr = Framer(5, 3)
for i in range(0,20):
    fr.setData([i+1,i+1,i+1])
    print(fr.getFrame())