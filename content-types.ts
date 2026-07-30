/**
 * Tipos TypeScript para las entradas de contenido
 */

export interface BaseContent {
  id: string;
  title: string;
  description?: string;
  author?: string;
  slug: string;
  /** Fecha de publicación en formato ISO (YYYY-MM-DD) */
  date: string;
  /** Categoría o tags asociados */
  tags?: string[];
}

export interface FirmaScarpaPost extends BaseContent {
  category: 'firma-scarpa';
  author: 'Ricardo Scarpa';
}

export interface JurisprudenciaCase extends BaseContent {
  category: 'jurisprudencia';
  caseNumber?: string;
  court?: string;
  subcategory?: string;
}

export interface ActualidadIAPost extends BaseContent {
  category: 'actualidad-ia';
  author: 'Derecho Artificial';
}

export interface NormativaDocument extends BaseContent {
  category: 'normativa';
  documentType?: string;
  officialSource?: string;
}

export interface GuiaProtocol extends BaseContent {
  category: 'guias';
  documentType?: string;
}

export type ContentItem = 
  | FirmaScarpaPost 
  | JurisprudenciaCase 
  | ActualidadIAPost 
  | NormativaDocument 
  | GuiaProtocol;
