import numpy as np
import matplotlib.pyplot as plt
from multiprocessing import Process, Queue
import time

zakres = np.arange(1000000, 10000001, 1000000)
lProcesy = [1, 2, 4, 16]
pi = np.pi

tSekwencyjne = []
tRownolegle = {}

for n in lProcesy:
    tRownolegle[n] = []

blSekwencyjne = []
blRownolegle = {}

for n in lProcesy:
    blRownolegle[n] = []

for punkty in zakres:

    # Sekwencyjne
    start = time.time()
    pWewnetrzne = 0
    for i in range(punkty):
        x = np.random.uniform(0, 1, 2)  # Losowanie (x, y)
        if x[0]**2 + x[1]**2 <= 1:
            pWewnetrzne += 1
    piSekwencyjne = 4 * pWewnetrzne / punkty
    tSekwencyjne.append(time.time() - start)
    blSekwencyjne.append(abs(piSekwencyjne - pi))

    # Rownolegle
    for nProces in lProcesy:
        pps = punkty // nProces  # Points Per Process
        queue = Queue()
        procesy = []

        # Procesy
        for i in range(nProces):
            def worker(q, n):
                inside = 0
                for j in range(n):
                    x = np.random.uniform(0, 1, 2)  # Losowanie (x, y)
                    if x[0]**2 + x[1]**2 <= 1:
                        inside += 1
                q.put(inside)

            proces = Process(target=worker, args=(queue, pps))
            procesy.append(proces)
            proces.start()

        # Wyniki
        pWewnRown = 0
        for i in range(nProces):
            pWewnRown += queue.get()

        for proces in procesy:
            proces.join()

        piRownolegle = 4 * pWewnRown / punkty
        tRownolegle[nProces].append(time.time() - start)
        blRownolegle[nProces].append(abs(piRownolegle - pi))

# Wykresy

# czasu
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
plt.plot(zakres, tSekwencyjne, label='Sekwencyjny')

for nProces in lProcesy:
    plt.plot(zakres, tRownolegle[nProces], label=f'Rownolegly ({nProces} procesow)')

plt.xlabel('Liczba punktow')
plt.ylabel('Czas [s]')
plt.title('Czas obliczen')
plt.legend()

# dokladnosci
plt.subplot(1, 2, 2)
plt.plot(zakres, blSekwencyjne, label='Sekwencyjny')

for nProces in lProcesy:
    plt.plot(zakres, blRownolegle[nProces], label=f'Rownolegly ({nProces} procesow)')

plt.xlabel('Liczba punktow')
plt.ylabel('Blad bezwzgledny')
plt.title('Dokladnosc')
plt.legend()
plt.tight_layout()
plt.show()
