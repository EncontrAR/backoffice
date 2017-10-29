import React from 'react';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import Box from '../../../../components/utility/box';
import { Input, Button, Col, Row, DatePicker } from 'antd';
import moment from 'moment-timezone';
import SelectMP from './selectMissingPerson';
import { Link } from 'react-router-dom';
import campaignActions from '../../../../redux/campaign/actions';
import { connect } from 'react-redux';

const TextArea = Input.TextArea;
const DATE_FORMAT = 'YYYY-MM-DD';
const TIMEZONE = 'America/Argentina/Buenos_Aires';

const {
  preCreateCampaign,
  createCampaign,
  clear
} = campaignActions;

class NewCampaign extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchDni: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.creationSuccess) this.props.history.goBack()    
  }

  componentWillUnmount() {
    this.props.clear()
  }

  handleSave = () => {
    this.props.createCampaign(Object.assign({}, this.props.newCampaign, {}))
  }

  handlePreCreateChange(key, value) {
    var newCampaign = Object.assign({}, this.props.newCampaign, {})
    newCampaign[key] = value
    this.props.preCreateCampaign(newCampaign)
  }

  handleInputChange(field, e) {
    this.handlePreCreateChange(field, e.target.value)
  }

  handleDniChange = (e) => {
    this.setState({ searchDni: e })
  }

  handleExpireDateChange = (e, d) => {
    var date = moment(d.format())
    this.handlePreCreateChange(
      'expire_date', 
      new Date(date.tz(TIMEZONE).format())
    )
  }

  render() {

    var styleColLeft = {
      paddingLeft: '30px',
      paddingRight: '30px'
    }

    return (
      <LayoutWrapper className="isoCheckoutPage">
        <Box>
          <div className="isoBillingAddressWrapper">

            <Row type="flex" justify="space-between">
              <Col span={4}>
                <h3 className="isoSectionTitle">Alta de campaña</h3>
              </Col>
              <Col span={5} offset={15}>
                 <Row type="flex" justify="space-around">
                  <Button type="primary" size="small" onClick={this.handleSave}>Guardar</Button>
                  <Button type="default" size="small">
                    <Link to={'/admin/campaigns'}>Cancelar</Link>
                  </Button>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col style={styleColLeft} span={18}>
                <Input
                  addonBefore="Título"
                  value={this.props.newCampaign.title}
                  onChange={this.handleInputChange.bind(this, 'title')}
                />

                <h4 style={{ marginTop: '15px' }}>Descripción</h4>
                <TextArea
                  value={this.props.newCampaign.description}
                  onChange={this.handleInputChange.bind(this, 'description')}
                />

                <h4 style={{ marginTop: '15px' }}>Fecha de expiración</h4>
                <DatePicker 
                  onChange={this.handleExpireDateChange.bind(this, 'expire_date')}
                  value={moment(this.props.newCampaign.expire_date, DATE_FORMAT)} 
                  format={DATE_FORMAT} />

                <SelectMP />

              </Col>
            </Row>
          </div>
        </Box>
      </LayoutWrapper>
    );
  }
}

NewCampaign.defaultProps = {
  newCampaign: {
    title: '',
    description: '',
    status: 'activated',
    missing_person_id: 0
  },
  creationSuccess: false
};

function mapStateToProps(state) {
  const { new_campaign, creationSuccess } = state.Campaign;
  return {
    newCampaign: new_campaign,
    creationSuccess: creationSuccess
  };
}

export default connect(mapStateToProps, { 
  preCreateCampaign, createCampaign, clear
})(NewCampaign);