import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import {
  Button,
  Icon,
  FormControl,
  ModalTrigger
} from 'modules/common/components';
import { Alert } from 'modules/common/utils';
import { CompanyForm } from '../';
import {
  FormWrapper,
  InputsWrapper,
  ListWrapper,
  Footer,
  TitleSpan,
  LoadMore
} from '../../styles';

const propTypes = {
  saveCustomerCompanies: PropTypes.func,
  customer: PropTypes.object.isRequired,
  companies: PropTypes.array.isRequired,
  addCompany: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired
};

const contextTypes = {
  closeModal: PropTypes.func.isRequired
};

class CompanyAssociate extends React.Component {
  constructor(props) {
    super(props);
    const customerCompanies = this.props.customer.companies || [];

    this.state = {
      customerCompanies,
      searchValue: ''
    };

    this.save = this.save.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  save() {
    const { customerCompanies } = this.state;
    const companyIds = [];
    customerCompanies.forEach(company => {
      companyIds.push(company._id.toString());
    });
    const doc = {
      companyIds
    };

    this.props.save(doc);
    this.context.closeModal();
  }

  handleChange(company, type) {
    const { customerCompanies } = this.state;

    if (type === 'addToCustomer') {
      if (customerCompanies.some(item => item._id === company._id))
        return Alert.warning('Already added');
      this.setState({
        customerCompanies: [...customerCompanies, company]
      });
    } else {
      this.setState({
        customerCompanies: customerCompanies.filter(item => item !== company)
      });
    }
  }

  search(e) {
    if (this.timer) clearTimeout(this.timer);
    const { search } = this.props;
    const value = e.target.value;

    this.timer = setTimeout(() => {
      search(value);
      this.setState({ searchValue: value });
    }, 1000);
  }

  loadMore() {
    this.props.search(this.state.searchValue, true);
  }

  render() {
    const onClick = () => {
      this.context.closeModal();
    };

    const { addCompany, customer, companies } = this.props;

    const addCompanyTrigger = (
      <span>
        Don&apos;t see the Company you&apos;re looking for? &ensp;
        <a>Create a company</a>
      </span>
    );

    return (
      <FormWrapper>
        <InputsWrapper>
          <FormControl
            placeholder="Type to search"
            onChange={e => this.search(e)}
          />
          <TitleSpan>Companies</TitleSpan>
          <ul>
            {companies.map(company => (
              <li key={company._id}>
                <Icon
                  icon="plus"
                  onClick={() => this.handleChange(company, 'addToCustomer')}
                />
                {company.name}
              </li>
            ))}
            <LoadMore onClick={this.loadMore}>Load More</LoadMore>
          </ul>
        </InputsWrapper>
        <ListWrapper>
          <TitleSpan>{customer.fullName}&apos;s Companies</TitleSpan>
          <ul>
            {this.state.customerCompanies.map(company => (
              <li key={company._id}>
                {company.name}
                <Icon
                  icon="close"
                  onClick={() =>
                    this.handleChange(company, 'removeFromCustomer')
                  }
                />
              </li>
            ))}
          </ul>
        </ListWrapper>
        <Modal.Footer>
          <Footer>
            <ModalTrigger title="New company" trigger={addCompanyTrigger}>
              <CompanyForm addCompany={addCompany} />
            </ModalTrigger>
            <Button btnStyle="simple" onClick={onClick.bind(this)}>
              <Icon icon="close" />CANCEL
            </Button>
            <Button btnStyle="success" onClick={this.save}>
              <Icon icon="checkmark" />SAVE
            </Button>
          </Footer>
        </Modal.Footer>
      </FormWrapper>
    );
  }
}

CompanyAssociate.propTypes = propTypes;
CompanyAssociate.contextTypes = contextTypes;

export default CompanyAssociate;
