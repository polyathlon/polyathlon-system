import { css } from '../../js/base-element.mjs';

const styles = css`

.label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 8px;
    font-weight: bold;
    color: var(--form-label-input-color, white);
}

label {
    color: var(--form-label-input-color, white);
}

legend {
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    color: var(--form-label-input-color, white);
}

.input-group {
    display: flex;
    width: 100%;
    align-items: center;
    position: relative;
}

input[type="text"],
input[type="password"],
input[type="mail"],
input[type="number"],
input[type="date"] {
    display: inline-block;
    width: 100%;
    margin: 8px 2px;
    padding: 12px 40px 12px 40px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    outline-color: var(--form-outline-color);
    color: var(--form-input-color, gray);
}

select {
    display: inline-block;
    width: 100%;
    margin: 8px 0px;
    padding: 12px 20px 12px 40px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 10px;
    font-size: 14px;
    outline-color: var(--form-outline-color);
    color: var(--form-input-color, gray);
}

select > option {
    font-size: 1.2rem;
    color: var(--form-input-color, gray);
}

option:hover {
    background-color: gray;
}

select > option:nth-child(1),
select > option:checked
 {
    background-color: gray;
    color: white;
}


[placeholder] {
    text-overflow: ellipsis;
}

.icon {
    display: inline-block;
    position: absolute;
    left: 8px
}

.button {
    display: inline-block;
    position: absolute;
    cursor: pointer;
    right: 10px;
}
`;

export default styles