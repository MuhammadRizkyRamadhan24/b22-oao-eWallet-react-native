import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Input} from 'native-base';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import {connect} from 'react-redux';
import {transferToUser} from '../redux/actions/transfers';
import {getUserById} from '../redux/actions/users';

class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdate: false,
    };
  }

  alertTransfer = values => {
    Alert.alert('Confirm Transfer', 'Do you want to Transfer?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => this.transfer(values),
      },
    ]);
  };

  transfer = values => {
    const {token} = this.props.auth;
    const data = {
      phoneNumberReceiver: values.phoneNumberReceiver,
      deductedBalance: values.deductedBalance,
      description: values.description,
    };
    this.props.transferToUser(token, data).then(() => {
      if (this.props.transfers.msg === 'Transfer successfully') {
        this.setState({
          isUpdate: !this.state.isUpdate,
        });
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Success',
          text2: 'Transfer Success!',
          visibilityTime: 800,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
        this.props.navigation.navigate('Dashboard');
      } else {
        this.setState({
          isUpdate: !this.state.isUpdate,
        });
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: `${this.props.transfers.msg}`,
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
      }
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const {token} = this.props.auth;
    if (prevState.isUpdate !== this.state.isUpdate) {
      this.props.getUserById(token);
    }
  }

  render() {
    const str = this.props.users.data.balance;
    const num = str.split(',').join('');
    const balance = parseInt(num, 10);
    console.log(balance);
    const validationSchema = Yup.object().shape({
      phoneNumberReceiver: Yup.string()
        .min(11, 'Minimal 11 nomor!')
        .required(''),
      deductedBalance: Yup.number()
        .min(10000, 'Minimal 10.000!')
        .max(balance, 'Balance tidak cukup!')
        .required(''),
    });
    return (
      <View style={styles.wrapper}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            phoneNumberReceiver: '',
            deductedBalance: '',
            description: '',
          }}
          onSubmit={values => this.alertTransfer(values)}>
          {({handleChange, handleBlur, handleSubmit, errors, values}) => (
            <View style={styles.wrapperInput}>
              <Input
                width={'95%'}
                marginTop={5}
                variant="underlined"
                type="number"
                keyboardType="number-pad"
                onChangeText={handleChange('phoneNumberReceiver')}
                onBlur={handleBlur('phoneNumberReceiver')}
                value={values.phoneNumberReceiver}
                placeholder="Masukan Nomor Tujuan"
              />
              {errors.phoneNumberReceiver ? (
                <Text style={styles.textError}>
                  {errors.phoneNumberReceiver}
                </Text>
              ) : null}
              <Text style={styles.text}>Nominal transfer</Text>
              <Input
                width={'95%'}
                marginTop={5}
                fontSize={20}
                height={20}
                backgroundColor="#E0DEDE"
                type="number"
                keyboardType="number-pad"
                onChangeText={handleChange('deductedBalance')}
                onBlur={handleBlur('deductedBalance')}
                value={values.deductedBalance}
                placeholder="Minimal 10.000"
              />
              {errors.deductedBalance ? (
                <Text style={styles.textError}>{errors.deductedBalance}</Text>
              ) : null}
              <Input
                width={'95%'}
                marginTop={10}
                variant="underlined"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="Pesan (optional)"
              />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.textButton}>Top Up Sekarang</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  transfers: state.transfers,
  auth: state.auth,
  users: state.users,
});

const mapDispatchToProps = {transferToUser, getUserById};

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapperInput: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    width: '95%',
    textAlign: 'left',
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
  },
  button: {
    marginTop: '95%',
    backgroundColor: '#440A67',
    width: '95%',
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textError: {
    width: '95%',
    textAlign: 'left',
    color: 'red',
    fontFamily: 'Roboto-Bold',
  },
  textButton: {
    fontFamily: 'Roboto-Bold',
    color: '#fff',
    fontSize: 15,
  },
});
