//
//  main.c
//  biovis
//
//  Created by Balaji Pandian on 4/13/13.
//  Copyright (c) 2013 Balaji Pandian. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>


int main(int argc, const char * argv[])
{
    
    FILE *f1;
    FILE *f2;
    
    char line[100];
    char line2[100];
    
    f1 = fopen("../3dData/PDBs/2YPI.pdb", "r");
    f2 = fopen("../3dData/PDBs/2YPI.pdb", "r");
    
    if (f1 == NULL)
    {
        printf("file is null");
        return 1;
    }
    
    int lineCounter = 0;
    
    while (fgets(line,100,f1))
    {
        ++lineCounter;
        if ((lineCounter < 639) || (lineCounter > 2522))
            continue;
        
        if ((line[0] == 'A') && (line[1] == 'T') && (line[2] == 'O') && (line[3] == 'M'))
        {
            if ((line[13] == 'C') && (line[14] == 'A'))
            {
                char *splitLine[13];
                char* result = NULL;
                int counter = 0;
                
                result = strtok(line, " ");
                while (result != NULL)
                {
                    splitLine[counter] = malloc(7);
                    strcpy(splitLine[counter++], result);
                    result = strtok(NULL, " ");
                }
                
                
                int lineCounter2 = 0;
                
                printf("{\"OriginAminoAcid\":%s, \"DestinationAminoAcids\":[", splitLine[5]);
                
                // Print out distance matrix
                while (fgets(line2,100,f2))
                {
                    ++lineCounter2;
                    if ((lineCounter2 < 639) || (lineCounter2 > 2522))
                        continue;
                    
                    if ((line2[0] == 'A') && (line2[1] == 'T') && (line2[2] == 'O') && (line2[3] == 'M'))
                    {
                        if ((line2[13] == 'C') && (line2[14] == 'A'))
                        {
                            
                            char* result2 = NULL;
                            int counter2 = 0;
                            char aaNumber2[5];
                            char x[8];
                            char y[8];
                            char z[8];
                            
                            result2 = strtok(line2, " ");
                            while (result2 != NULL)
                            {
                                if (counter2 == 5)
                                    strcpy(aaNumber2, result2);
                                if (counter2 == 6)
                                    strcpy(x, result2);
                                if (counter2 == 7)
                                    strcpy(y, result2);
                                if (counter2 == 8)
                                    strcpy(z, result2);
                                
                                result2 = strtok(NULL, " ");
                                counter2++;
                            }
                            
                            //calculate difference
                            double difX = atof(splitLine[6]) - atof(x);
                            double difY = atof(splitLine[7]) - atof(y);
                            double difZ = atof(splitLine[8]) - atof(z);
                            
                            float diff = sqrt((difX*difX) + (difY*difY) + (difZ*difZ));
                            
                            printf("\"%s\": %.3f,", aaNumber2, diff);
                            
                            
                        }
                        
                    }
                }
                
                printf("z]},\n");
                
                // Reset Line 2 pointer
                fseek(f2, 0, SEEK_SET);
                
                // Free old line1
                for (int i = 0; i < counter; i++)
                {
                    free(splitLine[i]);
                }
                
                
                
            }
        }
    }
    
    fclose(f1);
    fclose(f2);
    return 0;
}


