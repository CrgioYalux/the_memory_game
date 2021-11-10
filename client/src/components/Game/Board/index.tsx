import './Board.scss';
import { Fragment } from 'react';
import { BoardPiece } from '../utils';

interface BoardProps {
	board: BoardPiece[][];
	boardVisibility: boolean;
	completed: string[];
	select: (thisPiece: BoardPiece) => void;
}

export const Board = ({
	board,
	boardVisibility,
	completed,
	select,
}: BoardProps) => {
	return (
		<div className="Board-container">
			{board.map((row, row_index) => (
				<div key={row_index} className="Board-row">
					{row.map((piece) => {
						if (boardVisibility) {
							return (
								<Fragment key={piece.id}>
									<div className="Board-piece _initial">
										{piece.value.label}
									</div>
								</Fragment>
							);
						}
						if (completed.includes(piece.value.label)) {
							return (
								<Fragment key={piece.id}>
									<div className="Board-piece _hidden"></div>
								</Fragment>
							);
						}
						return (
							<Fragment key={piece.id}>
								{piece.value.visibility ? (
									<div className="Board-piece _selected">
										{piece.value.label}
									</div>
								) : (
									<div
										className="Board-piece"
										onClick={() =>
											select({
												value: piece.value,
												position: piece.position,
												id: piece.id,
											})
										}
									></div>
								)}
							</Fragment>
						);
					})}
				</div>
			))}
		</div>
	);
};
