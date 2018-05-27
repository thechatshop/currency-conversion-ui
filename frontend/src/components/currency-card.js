import React from 'react'
import debounce from 'debounce';
import {is, ifElse, pipe, map, find, propEq, prop, T} from 'ramda';
import {compose, withState, withStateHandlers, withProps, defaultProps, setPropTypes} from 'recompose';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Delete from '@material-ui/icons/Delete';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import {Icon} from '@material-ui/core';

const styles = theme => ({
	largeField: {
		fontSize: '2.5rem',
		'&:before': {
			borderBottomColor: 'white'
		},
	},
	expandButton: {
		position: 'absolute',
		top: '10px',
		right: '10px',
		zIndex: 99,
	},
	currencyCard: {
		position: 'relative'
	}
})

export const LargeInput = withStyles(styles)(
	props => <TextField
		InputProps={{
			classes: {
				input: props.classes.largeField,
				underline: props.classes.largeField
			}
		}}
		InputLabelProps={{
			shrink: true
		}}
		{...props}
	/>
)

const currencyCardPropTypes = setPropTypes({
	id: PropTypes.string.isRequired,
	onChangeRate: PropTypes.func,
	onChangeCurrency: PropTypes.func,
	onChangeAmount: PropTypes.func,
	onDelete: PropTypes.func,
	amount: PropTypes.number,
	rate: PropTypes.number,
	expanded: PropTypes.bool,
	availableCurrencies: PropTypes.arrayOf(PropTypes.string)
})

const currencyCardDefaults = defaultProps({
	onChangeRate: T,
	onChangeCurrency: T,
	onChangeAmount: T,
	onDelete: T,
	amount: 0,
	rate: 1,
	expanded: false,
	availableCurrencies: []
})

const currencyCardStateHandlers = withStateHandlers(
	props => ({
		expanded: props.expanded || false,
	}),
	{
		toggleCard: ({expanded}) => () => ({expanded: !expanded}),
	}
)

const manipulateActions = withProps(props => ({
	onChangeRate: e => props.onChangeRate(parseFloat(e.target.value) || 0),
	onChangeCurrency: e => props.onChangeCurrency(e.target.value),
	onChangeAmount: e => props.onChangeAmount(parseFloat(e.target.value) / props.rate),
}))

export const CurrencyCard = compose(
	currencyCardPropTypes,
	currencyCardDefaults,
	currencyCardStateHandlers,
	manipulateActions,
	withStyles(styles)
)(props => <Card {...props} className={props.classes.currencyCard}>
	<IconButton
		className={props.classes.expandButton}
		onClick={props.toggleCard}
	>
		{props.expanded ? (<ExpandLessIcon />) : (<ExpandMoreIcon />)}
	</IconButton>

	<CardContent>
		<LargeInput
			value={(props.amount * props.rate).toFixed(2)}
			placeholder="0.00"
			label={props.currency}
			onChange={props.onChangeAmount}
			fullWidth />
		<Collapse in={props.expanded}>
			<TextField
				label="Currency"
				value={props.currency}
				margin="normal"
				onChange={props.onChangeCurrency}
				select
				fullWidth
			>
				{map(option => (
					<MenuItem key={option} value={option}>
						{option}
					</MenuItem>
				), props.availableCurrencies)}
				{console.log(props)}
			</TextField>
			<TextField
				label="Rate"
				value={props.rate}
				onChange={props.onChangeRate}
				inputProps={{
					type: 'number',
					step: 0.001,
					min: 0
				}}
				margin="normal"
				fullWidth
			/>
		</Collapse>
	</CardContent>

	<CardActions>
		<Collapse in={props.expanded}>
			<Button
				onClick={props.onDelete}
				color="secondary"><Delete /> Delete</Button>
		</Collapse>
	</CardActions>
</Card>
)
