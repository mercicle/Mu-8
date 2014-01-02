######################################################################################################
# CS171 BioVis Project  
# Spring 2013
# Author: John Mercer
#create the datasets for PCA
# 1. alpha_and_turn_propensities (118)
# 2. beta_propensities (37)
# 3. composition (24)
# 4. hydrophobicity (149)
# 5. physicochemical_properties (46)
# 6. other_properties (28)
#######################################################################################################

###########################################################
#### first get the 544 pca dataset with all indices #######
###########################################################

biovis_data_dir = "/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/"
file <- "index_values_544_for_pca.csv"
data_path <- paste(biovis_data_dir,file,sep = "")

# this dataframe has the index values as the rows and each column is a different index
main_544_data <- read.table(data_path,header=TRUE,sep = ",")

#specify output directory
biovis_data_dir = "/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/"

# These are the file statements we will use to get the IDs each characteristic
# file <- "alpha_and_turn_propensities_from402.csv"
# file <- "beta_propensities_from402.csv"
# file <- "composition_from402.csv"
# file <- "hydrophobicity_from402.csv"
# file <- "other_properties_from402.csv"
# file <- "physicochemical_from402.csv"

# subset vars and rows help:
# http://www.ats.ucla.edu/stat/r/faq/subset_R.htm

##########################################################
########### alpha_and_turn_propensities ##################
##########################################################
file <- "alpha_and_turn_propensities_from402.csv"
data_path <- paste(biovis_data_dir,file,sep = "")
alpha_and_turn_index_list <- read.table(data_path,header=TRUE,sep = ",")
alpha_and_turn_index_list$ID = gsub("(^ +)|( +$)", "",alpha_and_turn_index_list$ID)
alpha_and_turn_pca_data <- subset(main_544_data, select = alpha_and_turn_index_list$ID)
write.csv(alpha_and_turn_pca_data,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/alpha_and_turn_pca_data.csv") 

##########################################################
###########      beta_propensities      ##################
##########################################################
file <- "beta_propensities_from402.csv"
data_path <- paste(biovis_data_dir,file,sep = "")
beta_index_list <- read.table(data_path,header=TRUE,sep = ",")
beta_index_list$ID = gsub("(^ +)|( +$)", "",beta_index_list$ID)
beta_propensities_pca_data <- subset(main_544_data, select = beta_index_list$ID)
write.csv(beta_propensities_pca_data,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/beta_propensities_pca_data.csv") 

##########################################################
###########        composition          ##################
##########################################################
file <- "composition_from402.csv"
data_path <- paste(biovis_data_dir,file,sep = "")
composition_index_list <- read.table(data_path,header=TRUE,sep = ",")
composition_index_list$ID = gsub("(^ +)|( +$)", "",composition_index_list$ID)
composition_pca_data <- subset(main_544_data, select = composition_index_list$ID)
write.csv(composition_pca_data,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/composition_pca_data.csv") 

##########################################################
###########        hydrophobicity       ##################
##########################################################
file <- "hydrophobicity_from402.csv"
data_path <- paste(biovis_data_dir,file,sep = "")
hydro_index_list <- read.table(data_path,header=TRUE,sep = ",")
hydro_index_list$ID = gsub("(^ +)|( +$)", "",hydro_index_list$ID)
hydro_pca_data <- subset(main_544_data, select = hydro_index_list$ID)
write.csv(hydro_pca_data,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/hydrophobicity_pca_data.csv") 

##########################################################
###########     Other properties        ##################
##########################################################
file <- "other_properties_from402.csv"
data_path <- paste(biovis_data_dir,file,sep = "")
other_index_list <- read.table(data_path,header=TRUE,sep = ",")
other_index_list$ID = gsub("(^ +)|( +$)", "",other_index_list$ID)
other_properties_pca_data <- subset(main_544_data, select = other_index_list$ID)
write.csv(other_properties_pca_data,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/other_properties_pca_data.csv") 

##########################################################
#######     Physicochemical properties     ###############
##########################################################
file <- "physicochemical_from402.csv"
data_path <- paste(biovis_data_dir,file,sep = "")
physico_index_list <- read.table(data_path,header=TRUE,sep = ",")
physico_index_list$ID = gsub("(^ +)|( +$)", "",physico_index_list$ID)
physico_properties_pca_data <- subset(main_544_data, select = physico_index_list$ID)
write.csv(physico_properties_pca_data,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/physico_properties_pca_data.csv")




# example to deal with missings
#http://stackoverflow.com/questions/7731192/replace-mean-or-mode-for-missing-values-in-r
indices_with_missings_pca_data <- subset(main_544_data, select = c("AVBF000101","AVBF000102","AVBF000107","ROSM880105"))

for (var in 1:ncol(indices_with_missings_pca_data)) {
  if (class(indices_with_missings_pca_data[,var])=="numeric") {
    indices_with_missings_pca_data[is.na(indices_with_missings_pca_data[,var]),var] <- mean(indices_with_missings_pca_data[,var], na.rm = TRUE)
  }
}