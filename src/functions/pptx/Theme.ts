import type { Slide, SlideTheme } from './types/slides'
import tinycolor from "tinycolor2";

import { TemplateCover, TemplateCatalog, TemplateCatalogListType01 } from 'src/functions/pptx/data/template01'



export const loadingDataToSlidesRedColor = (PPTXData: any) => {


    const TemplateCoverFilter = JSON.stringify(TemplateCover)
        .replace(/{{TemplateCover}}/g, PPTXData['封面']['标题'])
        .replace(/{{TemplateReporter}}/g, PPTXData['封面']['演讲人']);

    const TemplateCatalogFilter = JSON.stringify(TemplateCatalog)
    .replace(/{{TemplateCatalog01}}/g, PPTXData['目录']['内容'][0])
    .replace(/{{TemplateCatalog02}}/g, PPTXData['目录']['内容'][1])
    .replace(/{{TemplateCatalog03}}/g, PPTXData['目录']['内容'][2])
    .replace(/{{TemplateCatalog04}}/g, PPTXData['目录']['内容'][3])
    .replace(/{{TemplateCatalog05}}/g, PPTXData['目录']['内容'][4])
    .replace(/{{TemplateCatalog06}}/g, PPTXData['目录']['内容'][5])
    ;

    const TemplateCatalogListType01Filter = JSON.stringify(TemplateCatalogListType01)
        .replace(/{{TemplateCatalogListType01_Id}}/g, "01")
        .replace(/{{TemplateCatalogListType01_Name}}/g, "引言")
        .replace(/{{TemplateCatalogListType01_Title}}/g, "引言")
        .replace(/{{TemplateCatalogListType01_SubTitle_1}}/g, "背景介绍")
        .replace(/{{TemplateCatalogListType01_SubContent_1}}/g, "随着社会压力的增加，学生心理健康问题日益突出。")
        .replace(/{{TemplateCatalogListType01_SubTitle_2}}/g, "背景介绍")
        .replace(/{{TemplateCatalogListType01_SubContent_2}}/g, "随着社会压力的增加，学生心理健康问题日益突出。");

    return [JSON.parse(TemplateCoverFilter), JSON.parse(TemplateCatalogFilter), ...JSON.parse(TemplateCatalogListType01Filter)];

}

export const theme: SlideTheme = {
    themeColor: '#5b9bd5',
    fontColor: '#333',
    fontName: 'Microsoft Yahei',
    backgroundColor: '#fff',
    shadow: {
      h: 3,
      v: 3,
      blur: 2,
      color: '#808080',
    },
    outline: {
      width: 2,
      color: '#525252',
      style: 'solid',
    },
  }


export const loadingTheme = (layouts: Slide[], theme: any) => {

    const { themeColor, fontColor, fontName, backgroundColor } = theme;

    const subColor = tinycolor(fontColor).isDark()
        ? "rgba(230, 230, 230, 0.5)"
        : "rgba(180, 180, 180, 0.5)";

    const layoutsString = JSON.stringify(layouts)
        .replace(/{{themeColor}}/g, themeColor)
        .replace(/{{fontColor}}/g, fontColor)
        .replace(/{{fontName}}/g, fontName)
        .replace(/{{backgroundColor}}/g, backgroundColor)
        .replace(/{{subColor}}/g, subColor);

    return JSON.parse(layoutsString);

}

