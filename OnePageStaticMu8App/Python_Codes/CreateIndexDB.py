'''
Created on Mar 7, 2013

@author: mercicle
'''

import string
import csv
from random import random,randint,choice
from datetime import date
import time
#http://sourceforge.net/projects/numpy/?source=dlp
import numpy as np


#input data
directory = "/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/"
 
in_data = "index_data_544.txt"
out_data = "index_values_544_for_pca.csv"
ifile  = open(directory+in_data)
reader = csv.reader(ifile)

#read in the data
inData = []
outData = []
rIndex = 0
columnHeaders = []
indexData = []
indexDataRow = 0
prior_row=[]
index_values=[]

for row in reader:
    #H is the first row of the index metadata
    if row[0][0]=='H':
        indexDataRow = 0
        index_values = []
        columnHeaders.append(row[0][2:14])
    # I is the first of two rows with the actual index values
    if row[0][0]=='I':
        indexDataRow = 1

    #get the index values for the first row
    if indexDataRow > 0 and indexDataRow < 3 and row[0][0]!='I':
        split_row = row[0].split(" ")
        
        #some indices will have NA values because the index is not applicable to that amino acid
        for i in range(len(split_row)):
            if split_row[i]=='NA':
                index_values.append(split_row[i])
                #print columnHeaders[len(columnHeaders)-1]
            elif len(split_row[i])>0:
                index_values.append(float(split_row[i]))
        indexDataRow += 1
        #print "Index Values: ", index_values

    #after I have apended all 20 scores to the index_values vector, append to the final 
    #dataset called indexData
    if indexDataRow == 2:
        indexData.append(index_values)
    
    rIndex+=1

#first append the vector of id's (e.g. ANDN920101) 
outData.append(columnHeaders)

#now build the transpose version
for a in range(20):   
    aa_values=[]
    for j in range(len(indexData)):
        aa_values.append(indexData[j][a])
    outData.append(aa_values)

#so the final daatset will be 544 indices wide and 20 amino acids long

#now write the data to csv
with open(directory + out_data, 'wb') as f:
    writer = csv.writer(f)
    writer.writerows(outData)
print "Completed Creating: " + directory + out_data
