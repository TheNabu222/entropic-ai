
export interface ZettelNode {
  id: string;
  title: string;
  children: ZettelNode[];
  tags?: string[];
  kingdom?: string;
  links?: string[]; // IDs of linked notes
}
