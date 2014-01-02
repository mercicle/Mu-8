######################################################################################################
# CS171 BioVis Project  
# Spring 2013
# Author: John Mercer
# Code: Computes the principal components (and saves top prin comps)
# http://stat.ethz.ch/R-manual/R-patched/library/stats/html/princomp.html
# http://cran.r-project.org/web/packages/psych/index.html
#######################################################################################################

#load packages
library(psych)
library(GPArotation)

#simulate an example
x <- rnorm( 10, mean=20, sd=5 )
y <- rnorm( 10, mean=10, sd=2 )
z <- rnorm( 10, mean=15, sd=4 )
k <- rnorm( 10, mean=3, sd=0.4 )
mydata = data.frame(x=x,y=y,z=z,k=k)
pca_output <- principal(mydata, nfactors=2,rotate="varimax",scores=TRUE) 
#if scores are TRUE, and missing=TRUE, then impute missing values using either the median or the mean

#principal component scores
pca_output$scores
pca_output$values/sum(pca_output$values)


######################################################################################################################
## Start of prcomp code for each of the 6 classes of indices
######################################################################################################################
require(graphics)

##########################################################
########### alpha_and_turn_propensities ##################
##########################################################
for (var in 1:ncol(alpha_and_turn_pca_data)) {
  if (class(alpha_and_turn_pca_data[,var])=="numeric") {
    alpha_and_turn_pca_data[is.na(alpha_and_turn_pca_data[,var]),var] <- mean(alpha_and_turn_pca_data[,var], na.rm = TRUE)
  }
}

alpha_and_turn_pca_results <- prcomp(~ .,alpha_and_turn_pca_data, center=TRUE,scale = TRUE)
summary(alpha_and_turn_pca_results)

#Importance of components:
#                          PC1     PC2     PC3     PC4     PC5     PC6     PC7     PC8    PC9   PC10   PC11   PC12    PC13    PC14
#Standard deviation     7.7600 3.42107 2.93869 2.57624 2.30050 2.26154 1.75332 1.66951 1.5966 1.4120 1.3612 1.2991 1.17256 1.12525
#Proportion of Variance 0.5103 0.09918 0.07319 0.05625 0.04485 0.04334 0.02605 0.02362 0.0216 0.0169 0.0157 0.0143 0.01165 0.01073
#Cumulative Proportion  0.5103 0.60950 0.68269 0.73894 0.78379 0.82713 0.85318 0.87680 0.8984 0.9153 0.9310 0.9453 0.95696 0.96769
 
biplot(alpha_and_turn_pca_results)

#now compute the pincipal components with the eigenvectors
alpha_and_turn_prin_comps <- predict(alpha_and_turn_pca_results,alpha_and_turn_pca_data)
plot(alpha_and_turn_prin_comps[,1],alpha_and_turn_prin_comps[,2])
write.csv(alpha_and_turn_prin_comps,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/alpha_prin_comps.csv") 

##########################################################
###########       beta_propensities     ##################
##########################################################
for (var in 1:ncol(beta_propensities_pca_data)) {
  if (class(beta_propensities_pca_data[,var])=="numeric") {
    beta_propensities_pca_data[is.na(beta_propensities_pca_data[,var]),var] <- mean(beta_propensities_pca_data[,var], na.rm = TRUE)
  }
}

beta_propensities_pca_results <- prcomp(~ .,beta_propensities_pca_data, center=TRUE,scale = TRUE)
summary(beta_propensities_pca_results)

#Importance of components:
#                         PC1     PC2     PC3     PC4     PC5     PC6    PC7     PC8    PC9    PC10    PC11    PC12    PC13
#Standard deviation     5.2418 1.41498 1.26916 1.10451 0.96427 0.86212 0.7884 0.75631 0.7273 0.58217 0.48967 0.45392 0.36456
#Proportion of Variance 0.7426 0.05411 0.04353 0.03297 0.02513 0.02009 0.0168 0.01546 0.0143 0.00916 0.00648 0.00557 0.00359
#Cumulative Proportion  0.7426 0.79672 0.84025 0.87322 0.89835 0.91844 0.9352 0.95070 0.9650 0.97416 0.98064 0.98621 0.98980
 
biplot(beta_propensities_pca_results)

#now compute the pincipal components with the eigenvectors
beta_propensities_prin_comps <- predict(beta_propensities_pca_results,beta_propensities_pca_data)
plot(beta_propensities_prin_comps[,1],beta_propensities_prin_comps[,2])
write.csv(beta_propensities_prin_comps,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/beta_prin_comps.csv") 

##########################################################
###########       composition           ##################
##########################################################
for (var in 1:ncol(composition_pca_data)) {
  if (class(composition_pca_data[,var])=="numeric") {
    composition_pca_data[is.na(composition_pca_data[,var]),var] <- mean(composition_pca_data[,var], na.rm = TRUE)
  }
}

composition_pca_results <- prcomp(~ .,composition_pca_data, center=TRUE,scale = TRUE)
summary(composition_pca_results)

#Importance of components:
#                       PC1    PC2     PC3     PC4     PC5     PC6    PC7     PC8     PC9    PC10    PC11    PC12    PC13
#Standard deviation     3.8771 2.2605 0.99991 0.80783 0.79489 0.68553 0.5940 0.43067 0.39051 0.35461 0.32214 0.27865 0.20382
#Proportion of Variance 0.6263 0.2129 0.04166 0.02719 0.02633 0.01958 0.0147 0.00773 0.00635 0.00524 0.00432 0.00324 0.00173
#Cumulative Proportion  0.6263 0.8392 0.88089 0.90808 0.93441 0.95399 0.9687 0.97642 0.98277 0.98801 0.99234 0.99557 0.99730

biplot(composition_pca_results)

#now compute the pincipal components with the eigenvectors
composition_prin_comps <- predict(composition_pca_results,composition_pca_data)
plot(composition_prin_comps[,1],composition_prin_comps[,2])
write.csv(composition_prin_comps,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/composition_prin_comps.csv") 

##########################################################
###########       hydrophobicity        ##################
##########################################################
for (var in 1:ncol(hydro_pca_data)) {
  if (class(hydro_pca_data[,var])=="numeric") {
    hydro_pca_data[is.na(hydro_pca_data[,var]),var] <- mean(hydro_pca_data[,var], na.rm = TRUE)
  }
}

hydro_pca_results <- prcomp(~ .,hydro_pca_data, center=TRUE,scale = TRUE)
summary(hydro_pca_results)

#Importance of components:
#                         PC1     PC2     PC3     PC4     PC5     PC6     PC7     PC8     PC9    PC10    PC11    PC12    PC13
#Standard deviation     8.8466 3.73402 3.31842 3.11394 2.28059 2.24177 2.12416 1.88003 1.72602 1.64055 1.57913 1.49701 1.29349
#Proportion of Variance 0.5253 0.09358 0.07391 0.06508 0.03491 0.03373 0.03028 0.02372 0.01999 0.01806 0.01674 0.01504 0.01123
#Cumulative Proportion  0.5253 0.61883 0.69274 0.75782 0.79272 0.82645 0.85673 0.88046 0.90045 0.91851 0.93525 0.95029 0.96152


biplot(hydro_pca_results)

#now compute the pincipal components with the eigenvectors
hydro_prin_comps <- predict(hydro_pca_results,hydro_pca_data)
plot(hydro_prin_comps[,1],hydro_prin_comps[,2])
write.csv(hydro_prin_comps,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/hydro_prin_comps.csv") 

##########################################################
###########     other properties        ##################
##########################################################
for (var in 1:ncol(other_properties_pca_data)) {
  if (class(other_properties_pca_data[,var])=="numeric") {
    other_properties_pca_data[is.na(other_properties_pca_data[,var]),var] <- mean(other_properties_pca_data[,var], na.rm = TRUE)
  }
}

#http://stat.ethz.ch/R-manual/R-patched/library/stats/html/prcomp.html
other_pca_results <- prcomp(~ .,other_properties_pca_data, center=TRUE,scale = TRUE)
summary(other_pca_results)

#Importance of components:
#                       PC1    PC2     PC3     PC4     PC5     PC6    PC7     PC8     PC9    PC10    PC11    PC12    PC13
#Standard deviation     3.7241 2.0465 1.47927 1.34542 1.26273 1.02230 0.7902 0.77152 0.69578 0.63354 0.56303 0.48291 0.44467
#Proportion of Variance 0.4953 0.1496 0.07815 0.06465 0.05695 0.03732 0.0223 0.02126 0.01729 0.01433 0.01132 0.00833 0.00706
#Cumulative Proportion  0.4953 0.6449 0.72305 0.78770 0.84464 0.88197 0.9043 0.92553 0.94282 0.95715 0.96847 0.97680 0.98386

biplot(other_pca_results)

#now compute the pincipal components with the eigenvectors
other_prin_comps <- predict(other_pca_results,other_properties_pca_data)
plot(other_prin_comps[,1],other_prin_comps[,2])
write.csv(other_prin_comps,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/other_prin_comps.csv") 

##########################################################
#########  Physicochemical properties    #################
##########################################################
for (var in 1:ncol(physico_properties_pca_data)) {
  if (class(physico_properties_pca_data[,var])=="numeric") {
    physico_properties_pca_data[is.na(physico_properties_pca_data[,var]),var] <- mean(physico_properties_pca_data[,var], na.rm = TRUE)
  }
}

#http://stat.ethz.ch/R-manual/R-patched/library/stats/html/prcomp.html
physico_pca_results <- prcomp(~ .,physico_properties_pca_data, center=TRUE,scale = TRUE)
summary(physico_pca_results)

#Importance of components:
#                        PC1    PC2     PC3     PC4     PC5     PC6     PC7     PC8     PC9    PC10    PC11    PC12    PC13
#Standard deviation     5.2882 2.2257 2.00197 1.65923 1.32188 1.10587 0.91374 0.81684 0.73423 0.57076 0.54512 0.39715 0.37680
#Proportion of Variance 0.6079 0.1077 0.08713 0.05985 0.03799 0.02659 0.01815 0.01451 0.01172 0.00708 0.00646 0.00343 0.00309
#Cumulative Proportion  0.6079 0.7156 0.80276 0.86261 0.90059 0.92718 0.94533 0.95983 0.97155 0.97863 0.98509 0.98852 0.99161
 
biplot(physico_pca_results)

#now compute the pincipal components with the eigenvectors
physico_prin_comps <- predict(physico_pca_results,physico_properties_pca_data)
plot(physico_prin_comps[,1],physico_prin_comps[,2])
write.csv(physico_prin_comps,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/physico_prin_comps.csv") 


######################################################################################################################
## Scatter-plots of the principal components for each class of indices
# #http://www.statmethods.net/graphs/scatterplot.html
######################################################################################################################
# 
#pairs(~PC1+PC2+PC3,data=other_prin_comps, main="Top 3 PC for Other Properties")


