

scTIMo <- "MARTFFVGGNFKLNGSKQSIKEIVERLNTASIPENVEVVICPPATYLDYSVSLVKKPQVTVGAQNAYLKASGAFTGENSVDQIKDVGAKWVILGHSERRSYFHEDDKFIADKTKFALGQGVGVILCIGETLEEKKAGKTLDVVERQLNAVLEEVKDWTNVVVAYEPVWAIGTGLAATPEDAQDIHASIRKFLASKLGDKAASELRILYGGSANGSNAVTFKDKADVDGFLVGGASLKPEFVDIINSRN"
substr(scTIMo,152,155)
#"EEVK"
dTIMo <- "MARTPFVGGNWKMNGTKAEAKELVEALKAKLPDDVEVVVAPPAVYLDTAREALKGSKIKVAAQNCYKEAKGAFTGEISPEMLKDLGADYVILGHSERRHYFGETDELVAKKVAHALEHGLKVIACIGETLEEREAGKTEEVVFRQTKALLAGLGDEWKNVVIAYEPVWAIGTGKTATPEQAQEVHAFIRKWLAENVSAEVAESVRILYGGSVKPANAKELAAQPDIDGFLVGGASLKPEFLDIINSRN"
substr(dTIMo,152,155)
#"GLGD"

pos152 <- c()
pos153 <- c()
pos154 <- c()
pos155 <- c()
for (r in 1:nrow(aligned_proteins_wo_dscTIM)) {
  temp_string <- as.character(as.vector(aligned_proteins_wo_dscTIM[r,2]))
  residue <- substr(temp_string,152,152)
  if (residue != "-"){
    pos152 <- append(pos152,residue)    
  }
  residue <- substr(temp_string,153,153)
  if (residue != "-"){
    pos153 <- append(pos153,residue)    
  }
  residue <- substr(temp_string,154,154)
  if (residue != "-"){
    pos154 <- append(pos154,residue)    
  }  
  residue <- substr(temp_string,155,155)
  if (residue != "-"){
    pos155 <- append(pos155,residue)    
  } 
}

###################
#### pos152 #######
###################
#freq table
pos152_table <- table(pos152) 
# %'s
pos152_table_prop <- prop.table(pos152_table)
pos152_table_prop["G"]
# 16%
max(pos152_table_prop)
# 22%  - S
pos152_table_prop["E"]
# 3%

write.csv(pos152_table_prop,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/ProcessBook/pos152_table_prop.csv")

###################
#### pos153 #######
###################
#freq table
pos153_table <- table(pos153) 
# %'s
pos153_table_prop <- prop.table(pos153_table)
pos153_table_prop["L"] #dTIM has an L
# 7%
max(pos153_table_prop)
# 62%  - I 
pos153_table_prop["E"]
# None
write.csv(pos153_table_prop,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/ProcessBook/pos153_table_prop.csv")

