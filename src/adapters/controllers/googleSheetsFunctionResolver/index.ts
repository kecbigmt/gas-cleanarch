import googleSheetsFunctionResolverSendgrid from './_sendgrid';

const googleSheetsFunctionResolver = {
  sendgrid: {
    categoryStats: googleSheetsFunctionResolverSendgrid.categoryStats,
  },
};

export default googleSheetsFunctionResolver;

export type * from './_sendgrid';
