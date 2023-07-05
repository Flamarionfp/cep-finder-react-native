import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import style from './style';
import viacep from '../services/api';

type Address = {
  localidade: string;
  uf: string;
};

const ADDRESS_INITIAL_VALUES: Address = {
  localidade: '',
  uf: '',
};

export default function Home() {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<Address>(ADDRESS_INITIAL_VALUES);
  const [success, setSuccess] = useState(false);

  function validateCep() {
    const regex = /^[0-9]{8}$/;
    return regex.test(cep);
  }
  async function fetchAddressByCep() {
    const isValidCep = validateCep();

    if (!isValidCep) {
      throw new Error('Cep inválido');
    }

    try {
      const {data} = await viacep.get(`/${cep}/json`);
      setAddress(data);
      setSuccess(true);
    } catch (error: any) {
      setSuccess(false);
      Alert.alert(error.message);
    }
  }

  return (
    <SafeAreaView style={style.container}>
      <Text style={style.tittle}>CEP FINDER</Text>
      <TextInput
        value={cep}
        onChangeText={text => setCep(text)}
        placeholder="CEP"
        style={style.textoInput}
      />

      <TouchableOpacity style={style.button} onPress={fetchAddressByCep}>
        <Text style={style.buttonText}>BUSCAR ENDEREÇO</Text>
      </TouchableOpacity>

      {success && (
        <View style={style.returnContainer}>
          <Text>
            {address.localidade} - {address.uf}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
