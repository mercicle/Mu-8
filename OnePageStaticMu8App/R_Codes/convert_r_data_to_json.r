######################################################################################################
# CS171 BioVis Project  
# Spring 2013
# Author: John Mercer
# Code: Testing Data to figure out how to convert R datasets to JSON format easily
# http://stackoverflow.com/questions/3600431/is-it-possible-to-write-a-table-to-a-file-in-json-format-in-r
# http://theweiluo.wordpress.com/2011/09/30/r-to-json-for-d3-js-and-protovis/
######################################################################################################################

set.seed(1)
tbl <- table(round(runif(100, 1, 5)))

## 1  2  3  4  5 
## 9 24 30 23 14 

library(rjson)
sink("json.txt")
cat(toJSON(tbl))
sink()

file.show("json.txt")
## {"1":9,"2":24,"3":30,"4":23,"5":14}

## now try real data
sink("try_real_data.txt")
table_other_prin_comps <- as.table(other_prin_comps)
cat(toJSON(other_prin_comps))
sink()
json_version <- toJSON(other_prin_comps)
file.show("try_real_data.txt")

#############################################
toJSONarray <- function(dtf){
  clnms <- colnames(dtf)
  
  name.value <- function(i){
    quote <- '';
    if(class(dtf[, i])!='numeric'){
      quote <- '"';
    }
    
    paste('"', i, '" : ', quote, dtf[,i], quote, sep='')
  }
  
  objs <- apply(sapply(clnms, name.value), 1, function(x){paste(x, collapse=', ')})
  objs <- paste('{', objs, '}')
  
  res <- paste('[', paste(objs, collapse=', '), ']')
  
  return(res)
}

colname<-colnames(other_prin_comps)[1]

x<- list(pc1 = other_prin_comps[,1])
json <- toJSON(x)
sink("try_real_data.txt")
x<- list(pc1 = other_prin_comps[,1])
json <- toJSON(x)
cat(json)
sink()
file.show("try_real_data.txt")

plot.d <- defmacro( df, var, DOTS, col="red", title="", expr=
                      plot( df$var ~ df$Grp, type="b", col=col, main=title, ... )
)
plot.d( d, V1, col="blue" )

toJSON(c("foo","bar"))
data(iris)
toJSON(iris[1:5,])
toJSON(list(m=matrix(1:6,2)))

