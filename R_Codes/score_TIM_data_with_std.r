
################################# 
###   Alpha and Turn  ###########
################################# 
 
alpha_and_turn_fam_std = c();

for (i in 1:ncol(alpha_scored_family)){
  alpha_and_turn_fam_std <- append(alpha_and_turn_fam_std,sd(alpha_scored_family[,i]))
}

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_and_turn_fam_std.pdf")
hist( alpha_and_turn_fam_std, 
      main="Alpha and Turn: Standard Deviation Distribution",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

alpha_turn_dTIM_m_mean_std <- (alpha_and_turn_dTIM_means-alpha_and_turn_fam_means) / alpha_and_turn_fam_std

write.csv(alpha_turn_dTIM_m_mean_std,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_turn_dTIM_m_mean_std.csv") 

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_turn_dTIM_m_mean_std.pdf")
hist( alpha_turn_dTIM_m_mean_std, 
      main="Alpha and Turn: dTIM Minus Family Mean (Standardized)",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


#################################
###   Beta Propensity  ##########
#################################

beta_fam_std = c();

for (i in 1:ncol(beta_scored_family)){
  beta_fam_std <- append(beta_fam_std,sd(beta_scored_family[,i]))
}

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/beta_fam_std.pdf")
hist( beta_fam_std, 
      main="Beta: Standard Deviation Distribution",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

beta_dTIM_m_mean_std <- (beta_dTIM_means - beta_fam_means) / beta_fam_std

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/beta_dTIM_m_mean_std.pdf")
hist( beta_dTIM_m_mean_std, 
      main="Beta: dTIM Minus Family Mean (Standardized)",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

################################# 
######  Composition  ############
################################# 

comp_fam_std = c();

for (i in 1:ncol(comp_scored_family)){
  comp_fam_std <- append(comp_fam_std,sd(comp_scored_family[,i]))
}

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/comp_fam_std.pdf")
hist( comp_fam_std, 
      main="Composition: Standard Deviation Distribution",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

comp_dTIM_m_mean_std <- (comp_dTIM_means - comp_fam_means) / comp_fam_std

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/comp_dTIM_m_mean_std.pdf")
hist( comp_dTIM_m_mean_std, 
      main="comp: dTIM Minus Family Mean (Standardized)",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

################################# 
###### Hydrophobicity  ##########
################################# 

hydro_fam_std = c();

for (i in 1:ncol(hydro_scored_family)){
  hydro_fam_std <- append(hydro_fam_std,sd(hydro_scored_family[,i]))
}

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/hydro_fam_std.pdf")
hist( hydro_fam_std, 
      main="Hydrophobicity: Standard Deviation Distribution",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

hydro_dTIM_m_mean_std <- (hydro_dTIM_means - hydro_fam_means) / hydro_fam_std

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/hydro_dTIM_m_mean_std.pdf")
hist( hydro_dTIM_m_mean_std, 
      main="Hydrophobicity: dTIM Minus Family Mean (Standardized)",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

################################# 
#### Other Properties  ##########
################################# 
other_fam_std = c();

for (i in 1:ncol(other_scored_family)){
  other_fam_std <- append(other_fam_std,sd(other_scored_family[,i]))
}

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/other_fam_std.pdf")
hist( other_fam_std, 
      main="Other Properties: Standard Deviation Distribution",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

other_dTIM_m_mean_std <- (other_dTIM_means - other_fam_means) / other_fam_std

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/other_dTIM_m_mean_std.pdf")
hist( other_dTIM_m_mean_std, 
      main="Other Properties: dTIM Minus Family Mean (Standardized)",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


################################# 
# Physicochemical Properties  ###
################################# 
physico_fam_std = c();

for (i in 1:ncol(physico_scored_family)){
  physico_fam_std <- append(physico_fam_std,sd(physico_scored_family[,i]))
}

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/physico_fam_std.pdf")
hist( physico_fam_std, 
      main="physico Properties: Standard Deviation Distribution",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

physico_dTIM_m_mean_std <- (physico_dTIM_means - physico_fam_means) / physico_fam_std

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/physico_dTIM_m_mean_std.pdf")
hist( physico_dTIM_m_mean_std, 
      main="physico Properties: dTIM Minus Family Mean (Standardized)",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

############################################################################
####               Plot all histograms on One Plot                     #####
############################################################################
alpha_turn_dTIM_m_mean_std_df <- as.data.frame(alpha_turn_dTIM_m_mean_std)
beta_dTIM_m_mean_std_df  <- as.data.frame(beta_dTIM_m_mean_std)
comp_dTIM_m_mean_std_df <- as.data.frame(comp_dTIM_m_mean_std)
hydro_dTIM_m_mean_std_df  <- as.data.frame(hydro_dTIM_m_mean_std)
other_dTIM_m_mean_std_df  <- as.data.frame(other_dTIM_m_mean_std)
physico_dTIM_m_mean_std_df <- as.data.frame(physico_dTIM_m_mean_std)

#Now, combine your two dataframes into one.  First make a new column in each.
alpha_turn_dTIM_m_mean_std_df$characteristic <- 'Alpha-Turn Propensity'
beta_dTIM_m_mean_std_df$characteristic  <- 'Beta Propensity'
comp_dTIM_m_mean_std_df$characteristic <- 'Composition'
hydro_dTIM_m_mean_std_df$characteristic  <-  'Hydrophobicity'
other_dTIM_m_mean_std_df$characteristic  <- 'Other Properties'
physico_dTIM_m_mean_std_df$characteristic <-  'Physicochemical Properties'

names(alpha_turn_dTIM_m_mean_std_df)[1] <- "dTIMmMean"
names(beta_dTIM_m_mean_std_df)[1] <- "dTIMmMean"
names(comp_dTIM_m_mean_std_df)[1] <- "dTIMmMean"
names(hydro_dTIM_m_mean_std_df)[1] <- "dTIMmMean"
names(other_dTIM_m_mean_std_df)[1] <- "dTIMmMean"
names(physico_dTIM_m_mean_std_df)[1] <- "dTIMmMean"


#and combine into your new data frame vegLengths
allDistsStd <- rbind(alpha_turn_dTIM_m_mean_std_df, 
                  beta_dTIM_m_mean_std_df,
                  comp_dTIM_m_mean_std_df,
                  hydro_dTIM_m_mean_std_df,
                  other_dTIM_m_mean_std_df,
                  physico_dTIM_m_mean_std_df)

#now make your lovely plot
ggplot(allDistsStd, aes(x = dTIMmMean))  +
  geom_histogram(data=subset(allDistsStd,characteristic == "alpha"),fill = "red", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "beta"),fill = "grey", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "comp"),fill = "blue", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "hydro"),fill = "green", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "other"),fill = "purple", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "physico"),fill = "yellow", alpha = 0.2)

ggplot(allDistsStd, aes(x = dTIMmMean))  +
  geom_histogram(data=subset(allDistsStd,characteristic == "Alpha-Turn Propensity"),fill = "red", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "Beta Propensity"),fill = "grey", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "Composition"),fill = "blue", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "Hydrophobicity"),fill = "green", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "Other Properties"),fill = "purple", alpha = 0.2) +
  geom_histogram(data=subset(allDistsStd,characteristic == "Physicochemical Properties"),fill = "yellow", alpha = 0.2) + 
  geom_histogram(aes(fill = ..count..)) +
  scale_fill_gradient("count", low = "red",high = "green") +
  facet_wrap(~ characteristic)
+ ggtitle("his")


############################################################################
####                     Scatterplot Matrix                            #####
############################################################################
alpha_turn_dTIM_m_mean_std_df <- as.data.frame(alpha_turn_dTIM_m_mean_std)
beta_dTIM_m_mean_std_df  <- as.data.frame(beta_dTIM_m_mean_std)
comp_dTIM_m_mean_std_df <- as.data.frame(comp_dTIM_m_mean_std)
hydro_dTIM_m_mean_std_df  <- as.data.frame(hydro_dTIM_m_mean_std)
other_dTIM_m_mean_std_df  <- as.data.frame(other_dTIM_m_mean_std)
physico_dTIM_m_mean_std_df <- as.data.frame(physico_dTIM_m_mean_std)

allDistsStd <- data.frame(AlphaTurnPropensity = alpha_turn_dTIM_m_mean_std ,
                       BetaPropensity = beta_dTIM_m_mean_std ,
                       Composition = comp_dTIM_m_mean_std ,
                       Hydrophobicity = hydro_dTIM_m_mean_std ,
                       OtherCharacteristics = other_dTIM_m_mean_std ,
                       PhysicochemicalProperties = physico_dTIM_m_mean_std )

pairs(~AlphaTurnPropensity
      +BetaPropensity 
      + Composition 
      + Hydrophobicity
      + OtherCharacteristics
      + PhysicochemicalProperties
      ,data = allDistsStd, 
      main="ScatterPlot of AA Characteristics: (dTIM Principal Component - Mean Principal Component) / Std")

