import classNames from 'classnames';

type Element = `__${Uncapitalize<string>}`;
type Modifier = `--${Uncapitalize<string>}`;

export function getBem<Block extends Capitalize<string>>(_block: Block) {
  return (
    ...args: Array<
      | Block
      | `${Block}${Element}`
      | `${Block}${Modifier}`
      | `${Block}${Element}${Modifier}`
      | null
      | undefined
    >
  ) => classNames(args);
}
