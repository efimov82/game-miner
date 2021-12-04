import './Cell.scss';

export function Cell(props) {
    function getCellClass(value) {
        return value === ' '
            ? 'empty'
            : value === 'm'
                ? 'mine'
                : value === 0 ? '' :  'number';
    }

    return (
        <div className={`cell-wrapper ${getCellClass(props.value)}`}>{ props.value !== ' ' ? props.value : ''}</div>
    );
}
