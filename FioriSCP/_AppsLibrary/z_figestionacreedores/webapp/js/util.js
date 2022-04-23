var  validar_rut = {
		// Valida el rut con su cadena
		// completa "XXXXXXXX-X"
		validaRut : function(rutCompleto) {
			if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
				return false;
			var tmp = rutCompleto.split('-');
			var digv = tmp[1];
			var rut = tmp[0];
			if (digv == 'K')
				digv = 'k';
			return (validar_rut.dv(rut) == digv);
		},
		dv : function(T) {
			var M = 0, S = 1;
			for (; T; T = Math.floor(T / 10)) S = (S + T % 10 * (9 - M++ % 6)) % 11;
			return S ? S - 1 : 'k';
		}
}
var crea_ids = {
		'all_id' : ['selectGrpCta','selectTrat','name1','direc','concep','selectPais','txtCiudad','sex','kunnr'
			,'stcd1','fna','lna','pro','selectSociedades','selectCondPagoS','selectViasPago','selectPaiBank'
			,'selectClaBank','cta','selectPaiBank2'
			,'selectClaBank2','cta2','selectPaiBank3'
			,'selectClaBank3','cta3','selectIndRet','selectGrpComp','selectMoneda','inpCtaAsoc','recaltpago'
			,'email1','email2','ico1','GrupEsqPro','ctrlConf','selectMoneda','selectCondPagoC'],
			'btng' : 'btnGuarda',
			'grupCta' : 'selectGrpCta',
			'selectTrat' : 'selectTrat',
			'name1' : 'name1',
			'direc' : 'direc',
			'concep' : 'concep',
			'selectPais' :'selectPais',
			'txtCiudad' : 'txtCiudad',
			'stcd1' : 'stcd1',
			'fna' : 'fna',
			'lna' : 'lna',
			'pro' : 'pro',
			'selectSociedades' : 'selectSociedades',
			'selectCondPagoS' :'selectCondPagoS',
			'selectViasPago' : 'selectViasPago',
			'selectPaiBank' : 'selectPaiBank',
			'selectClaBank' : 'selectClaBank',
			'cta' :'cta',
			'selectPaiBank2' : 'selectPaiBank2',
			'selectClaBank2' : 'selectClaBank2',
			'cta2' :'cta2',
			'selectPaiBank3' : 'selectPaiBank3',
			'selectClaBank3' : 'selectClaBank3',
			'cta3' :'cta3',
			'recaltpago':'recaltpago',
			'selectIndRet' : 'selectIndRet',
			'selectGrpComp' : 'selectGrpComp',	
			'selectMoneda' : 'selectMoneda',
			'inpCtaAsoc' : 'inpCtaAsoc',
			'email1' : 'email1',
			'email2' : 'email2',
			'ico1' : 'ico1',
			'GrupEsqPro' : 'GrupEsqPro',
			'ctrlConf' : 'ctrlConf',
			'sex': 'sex',
			'deudorB' : 'onSearshDeudor',
			'deudor' :'kunnr',
			'mondp' :'selectMoneda',
			'condpa' : 'selectCondPagoC'
};
var mod_ids = {
		'all_id' : ['selectTratM','name1M','direcM','concepM','selectPaisM','txtCiudadM','sexM','kunnrM'
			,'stcd1M','fnaM','lnaM','proM','selectSociedadesM','selectCondPagoSM','selectViasPagoM','selectPaiBankM'
			,'selectClaBankM','ctaM','selectPaiBankM2'
			,'selectClaBankM2','ctaM2','selectPaiBankM3'
			,'selectClaBankM3','ctaM3','selectIndRetM','selectGrpCompM','selectMonedaM','inpCtaAsoc','recaltpagoM'
			,'email1M','email2M','ico1M','GrupEsqProM','ctrlConfM','selectMonedaM','selectCondPagoCM'],
			'btng' : 'btnGuardarM',
			'grupCta' : 'inpKtokkM',
			'selectTrat' : 'selectTratM',
			'name1' : 'name1M',
			'direc' : 'direcM',
			'concep' : 'concepM',
			'selectPais' :'selectPaisM',
			'txtCiudad' : 'txtCiudadM',
			'stcd1' : 'stcd1M',
			'fna' : 'fnaM',
			'lna' : 'lnaM',
			'pro' : 'proM',
			'selectSociedades' : 'selectSociedadesM',
			'selectCondPagoS' :'selectCondPagoSM',
			'selectViasPago' : 'selectViasPagoM',
			'selectPaiBank' : 'selectPaiBankM',
			'selectClaBank' : 'selectClaBankM',
			'cta' :'ctaM',
			'selectPaiBank2' : 'selectPaiBankM2',
			'selectClaBank2' : 'selectClaBankM2',
			'cta2' :'ctaM2',
			'selectPaiBank3' : 'selectPaiBankM3',
			'selectClaBank3' : 'selectClaBankM3',
			'cta3' :'ctaM3',
			'recaltpago':'recaltpagoM',
			'selectIndRet' : 'selectIndRetM',
			'selectGrpComp' : 'selectGrpCompM',
			'selectMoneda' : 'selectMonedaM',
			'inpCtaAsoc' : 'hkont',
			'email1' : 'email1M',
			'email2' : 'email2M',
			'ico1' : 'ico1M',
			'GrupEsqPro' : 'GrupEsqProM',
			'ctrlConf' : 'ctrlConfM',
			'sex': 'sexM',
			'deudorB' : 'onSearshDeudorM',
			'deudor' :'kunnrM',
			'mondp' :'selectMonedaM',
			'condpa' : 'selectCondPagoCM'
};
var TRATAMIENTO = [
	{ANRED:'0001',ANRED_DESC:'Sra.'},
	{ANRED:'0002',ANRED_DESC:'Sr.'},
	{ANRED:'0003',ANRED_DESC:'Empresa'},
	{ANRED:'0004',ANRED_DESC:'Señores'},
	{ANRED:'0005',ANRED_DESC:'Estimados'},
	{ANRED:'0006',ANRED_DESC:'Persona Natural'},
	{ANRED:'0007',ANRED_DESC:'Persona Jurídica'},
	{ANRED:'0008',ANRED_DESC:'Fondo de Inversión'},
	{ANRED:'0009',ANRED_DESC:'(Otros)'}];
var TRATAMIENTO_PEXT = [
	{ANRED:'0006',ANRED_DESC:'Persona Natural'},
	{ANRED:'0007',ANRED_DESC:'Persona Jurídica'},
	{ANRED:'0008',ANRED_DESC:'Fondo de Inversión'}];





