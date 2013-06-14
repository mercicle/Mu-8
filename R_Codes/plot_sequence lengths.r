######################################################################################################
# CS171 BioVis Project  
# Spring 2013
# Author: John Mercer
# Code: This code computes the distribution for the TIM sequence lengths in the (for all TIMs)
#######################################################################################################

sequenceLengths <- read.table("/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/csvLengths.txt",sep = ",")

TIM_Sequence_Length <- unlist(sequenceLengths)
pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/TIM_sequence_lengths.pdf")
hist( TIM_Sequence_Length, 
      main="Distribution of TIM Sequence Lengths",
      freq=FALSE,
      breaks = 20, 
      col="blue",
      border="black")
#axis(2, at = seq(0, 1, 0.1), labels = paste(0:10, "%", sep = ""))
#axis(1, at = seq(0, 1000, 1), labels = paste(0:1000, sep = ""))
dev.off()

hist( TIM_Sequence_Length, 
      main="Distribution of TIM Sequence Lengths",
      freq=TRUE,
      breaks = 20, 
      col="lightblue", 
      xlab="Length of Sequence",
      border="black")