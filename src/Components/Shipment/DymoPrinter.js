import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import Button from "@material-ui/core/Button";

export default function DymoPrinter(props) {
  const [data, setData] = useState([]);
  const [Dymo, setDymo] = useState(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function makeLabel(productName, barcode, expiration) {
    productName = productName.replaceAll("&", "&amp;");
    console.log(productName);
    const line1 = productName.substring(0, 32);
    const line2 = productName.substring(33, 64);
    const labelXml = `<?xml version="1.0" encoding="utf-8"?>
    <DesktopLabel Version="1">
      <DYMOLabel Version="3">
        <Description>DYMO Label</Description>
        <Orientation>Portrait</Orientation>
        <LabelName>Small30334</LabelName>
        <InitialLength>0</InitialLength>
        <BorderStyle>SolidLine</BorderStyle>
        <DYMORect>
          <DYMOPoint>
            <X>0.03999997</X>
            <Y>0.06</Y>
          </DYMOPoint>
          <Size>
            <Width>2.17</Width>
            <Height>1.13</Height>
          </Size>
        </DYMORect>
        <BorderColor>
          <SolidColorBrush>
            <Color A="1" R="0" G="0" B="0"></Color>
          </SolidColorBrush>
        </BorderColor>
        <BorderThickness>1</BorderThickness>
        <Show_Border>False</Show_Border>
        <DynamicLayoutManager>
          <RotationBehavior>ClearObjects</RotationBehavior>
          <LabelObjects>
            <TextObject>
              <Name>ITextObject0</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="0" R="1" G="1" B="1"></Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="0" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Middle</VerticalAlignment>
              <FitMode>None</FitMode>
              <IsVertical>False</IsVertical>
              <FormattedText>
                <FitMode>None</FitMode>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Middle</VerticalAlignment>
                <IsVertical>False</IsVertical>
                <LineTextSpan>
                  <TextSpan>
                    <Text>${line1}</Text>
                    <FontInfo>
                      <FontName>Segoe UI</FontName>
                      <FontSize>8</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"></Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
                <LineTextSpan>
                  <TextSpan>
                    <Text>${line2}</Text>
                    <FontInfo>
                      <FontName>Segoe UI</FontName>
                      <FontSize>8</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"></Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
              </FormattedText>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.08842366</X>
                  <Y>0.06000001</Y>
                </DYMOPoint>
                <Size>
                  <Width>2.073153</Width>
                  <Height>0.3584785</Height>
                </Size>
              </ObjectLayout>
            </TextObject>
            <BarcodeObject>
              <Name>IBarcodeObject0</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="1" R="1" G="1" B="1"></Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <BarcodeFormat>Code128Auto</BarcodeFormat>
              <Data>
                <MultiDataString>
                  <DataString>${barcode}</DataString>
                </MultiDataString>
              </Data>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Middle</VerticalAlignment>
              <Size>SmallMedium</Size>
              <TextPosition>Bottom</TextPosition>
              <FontInfo>
                <FontName>Arial</FontName>
                <FontSize>12</FontSize>
                <IsBold>False</IsBold>
                <IsItalic>False</IsItalic>
                <IsUnderline>False</IsUnderline>
                <FontBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </FontBrush>
              </FontInfo>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.08842366</X>
                  <Y>0.625</Y>
                </DYMOPoint>
                <Size>
                  <Width>2.078049</Width>
                  <Height>0.5178983</Height>
                </Size>
              </ObjectLayout>
            </BarcodeObject>
            <TextObject>
              <Name>ITextObject1</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="0" R="1" G="1" B="1"></Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="0" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Middle</VerticalAlignment>
              <FitMode>None</FitMode>
              <IsVertical>False</IsVertical>
              <FormattedText>
                <FitMode>None</FitMode>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Middle</VerticalAlignment>
                <IsVertical>False</IsVertical>
                <LineTextSpan>
                  <TextSpan>
                    <Text>${
                      expiration ? `Expiration: ${expiration}` : ""
                    }</Text>
                    <FontInfo>
                      <FontName>Segoe UI</FontName>
                      <FontSize>8</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"></Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
              </FormattedText>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.1499714</X>
                  <Y>0.4184785</Y>
                </DYMOPoint>
                <Size>
                  <Width>1.931201</Width>
                  <Height>0.1489203</Height>
                </Size>
              </ObjectLayout>
            </TextObject>
          </LabelObjects>
        </DynamicLayoutManager>
      </DYMOLabel>
      <LabelApplication>Blank</LabelApplication>
      <DataTable>
        <Columns></Columns>
        <Rows></Rows>
      </DataTable>
    </DesktopLabel>`;
    return labelXml;
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://firebasestorage.googleapis.com/v0/b/inventorywebapp-d01bc.appspot.com/o/dymo.connect.framework.js?alt=media&token=29773759-4239-498e-8382-b82dabde5991";
    script.async = true;
    script.onload = () => initDymo();
    document.body.appendChild(script);
  }, []);

  function initDymo() {
    let dymo = window.dymo;
    console.log(dymo);
    setDymo(dymo);
  }

  function print() {
    // const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(labelXml, "text/xml");

    // let labelSetXml = new Dymo.label.framework.LabelSetBuilder();
    for (let product of data) {
      Dymo.label.framework.printLabel(
        "DYMO LabelWriter 450 Turbo",
        Dymo.label.framework.createLabelWriterPrintParamsXml({
          copies: parseInt(product.quantity),
        }),
        makeLabel(product.name, product.FNSKU, product.expiration),
        ""
      );
    }
  }

  return <Button onClick={() => print()}>Print</Button>;
}
