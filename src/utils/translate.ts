export function normalizeString(str: string) {
  const from =
    'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ';
  const to =
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
  for (let i = 0; i < from.length; i++) {
    str = str.replace(new RegExp(from[i], 'gi'), to[i]);
  }
  return str.toLowerCase();
}
