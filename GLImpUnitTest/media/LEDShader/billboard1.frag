/*************************************************************
*Shader by: Jason Gorski
*Email: jasejc@aol.com
*CS594 University of Illinios at Chicago
*
*LED Billboard Tutorial
*For more information about this shader view the tutorial page
*at http://www2.uic.edu/~jgorsk2 or email me
*************************************************************/

#define KERNEL_SIZE 9

uniform int pixelSize; //size of bigger "pixel regions". These regions are forced to be square
uniform ivec2 billboardSize; //dimensions in pixels of billboardTexture
uniform sampler2D billboardTexture; //texure to be applied to billboard quad

vec2 texCoords[KERNEL_SIZE]; //stores texture lookup offsets from a base case
                         
void main(void)
{
   vec4 avgColor; //will hold our averaged color from our sample points
   vec2 texCoordsStep = 1.0/(vec2(float(billboardSize.x),float(billboardSize.y))/float(pixelSize)); //width of "pixel region" in texture coords
   vec2 pixelBin = floor(gl_TexCoord[0].st/texCoordsStep); //"pixel region" number counting away from base case
   vec2 inPixelStep = texCoordsStep/3.0; //width of "pixel region" divided by 3 (for KERNEL_SIZE = 9, 3x3 square)
   vec2 inPixelHalfStep = inPixelStep/2.0;

   //use offset (pixelBin * texCoordsStep) from base case (the lower left corner of billboard) to compute texCoords
   texCoords[0] = vec2(inPixelHalfStep.x, inPixelStep.y*2.0 + inPixelHalfStep.y) + pixelBin * texCoordsStep;
   texCoords[1] = vec2(inPixelStep.x + inPixelHalfStep.x, inPixelStep.y*2.0 + inPixelHalfStep.y) + pixelBin * texCoordsStep;
   texCoords[2] = vec2(inPixelStep.x*2.0 + inPixelHalfStep.x, inPixelStep.y*2.0 + inPixelHalfStep.y) + pixelBin * texCoordsStep;
   texCoords[3] = vec2(inPixelHalfStep.x, inPixelStep.y + inPixelHalfStep.y) + pixelBin * texCoordsStep;
   texCoords[4] = vec2(inPixelStep.x + inPixelHalfStep.x, inPixelStep.y + inPixelHalfStep.y) + pixelBin * texCoordsStep;
   texCoords[5] = vec2(inPixelStep.x*2.0 + inPixelHalfStep.x, inPixelStep.y + inPixelHalfStep.y) + pixelBin * texCoordsStep;
   texCoords[6] = vec2(inPixelHalfStep.x, inPixelHalfStep.y) + pixelBin * texCoordsStep;
   texCoords[7] = vec2(inPixelStep.x + inPixelHalfStep.x, inPixelHalfStep.y) + pixelBin * texCoordsStep;
   texCoords[8] = vec2(inPixelStep.x*2.0 + inPixelHalfStep.x, inPixelHalfStep.y) + pixelBin * texCoordsStep;
   
   //take average of 9 pixel samples
   avgColor = texture2D(billboardTexture, texCoords[0]) +
              texture2D(billboardTexture, texCoords[1]) +
              texture2D(billboardTexture, texCoords[2]) +
              texture2D(billboardTexture, texCoords[3]) +
              texture2D(billboardTexture, texCoords[4]) +
              texture2D(billboardTexture, texCoords[5]) +
              texture2D(billboardTexture, texCoords[6]) +
              texture2D(billboardTexture, texCoords[7]) +
              texture2D(billboardTexture, texCoords[8]);
   
   avgColor /= float(KERNEL_SIZE);
   
   gl_FragColor = avgColor;
}
