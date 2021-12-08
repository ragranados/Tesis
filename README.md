# Propuesta de herramienta geoespacial para la determinación de los impactos acumulados hacia los recursos hídricos subterráneo  

## Acerca del proyecto  
Este proyecto fue hecho para el MARN (Ministerio de Medio Ambiente y Recursos Naturales), para poder visualizar el impacto que tienen las industrias y proyectos que hacen uso de los recursos hídricos subterráneos y para poder evaluar cómo afecta la inclusión de un nuevo proyecto que requiera el uso de estos recursos hídricos.

## Requisitos de instalación:
- Se necesita tener NodeJS instalado, como minimo versión 14.15.5 y maximo la ultima LTS hasta la fecha (16.13.1).  
- Los navegadores recomendados son:
  -  Google Chrome
  -  Microsoft Edge
  -  Opera
  
## Variables de entorno:    
En la carpeta raiz se tiene un archivo .env.example, se borra el .example para que quede operativo, luego llenar las variables de entorno con las siguientes especificaciones:    
- REACT_APP_PROYECTOS (Obligatoria): En esta variable se coloca la URL completa que apunta hacia la capa donde se encuentra la información de los proyectos.
- REACT_APP_CUENCAS (Obligatoria): En esta variable se coloca la URL completa que apunta hacia la capa donde se encuentra la información de las cuencas.
- REACT_APP_ARCGIS_API_KEY (Opcional): En esta variable se coloca la KEY para la licencia de ARCGIS.
