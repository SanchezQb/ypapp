import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { dispatchNotification } from '../../../helpers/uploader';
import { VoteResponse } from '../../../actions/thunks/polls';
import { height, width, defaultGreen, bigButton, buttonText, DisplayRadios } from '../../../mixins';

/* eslint-disable react/jsx-indent, react/jsx-indent-props,  */
const RenderPollForm = ({ data, pushUpValue, handleSubmit, heatMap, wantsToSeeResult }) => {

  const RenderItemCard = ({ question, options, index }) => (
        <View style={{ maxHeight: height * 0.34, width, marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', marginBottom: 25, color: '#626363' }}>{question}</Text>
            { !wantsToSeeResult && <DisplayRadios values={options} pushToState={value => pushUpValue(index)(value) } style={{ paddingLeft: 10, marginTop: 10 }}/> }
            { wantsToSeeResult && <RenderResultsForQuestion data={heatMap[`${index}`]} />}
        </View>
  );

  const questions = () => Object.values(data.questions).map((question, index) => <RenderItemCard key={`item-${index}`} index={index} question={question} options={Object.keys(data.options[`${index}`])} />);
  return (
        <View style={{
          flex: 1,
          justifyContent: 'space-around',
          paddingTop: 20,
          paddingLeft: 20,
          paddingBottom: 30
        }}>
            <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 10}}>{ data.title }</Text>
            <ScrollView
                style={{
                  height: height * 0.8,
                  width,
                  paddingTop: 30,
                }}
                contentContainerStyle={{
                  justifyContent: 'space-between',
                }}
            >
                { data.questions && data.questions && questions() }
            </ScrollView>
            {
                !wantsToSeeResult && (
            <TouchableOpacity style={{ ...bigButton, }} onPress={handleSubmit}> 
                <Text style={{ ...buttonText }}>
                SUBMIT
                </Text>
            </TouchableOpacity>
                )}
                {
                    wantsToSeeResult && <Text style={{ color: '#D7DBDD', fontSize: 12, fontWeight: '500', alignSelf: 'center' }}> You already participated in this poll </Text>
                }
        </View>
  );
};

const RenderResultsForQuestion = ({ data }) => {
  const RenderItemCard = ({ dataX }) => (
        <View style={{
          width,
          height: 30,
          position: 'relative',
          paddingLeft: 10,
          marginBottom: 18,
        }}>
        <View style={{
          height: 30,
          width: dataX.width + 5,
          backgroundColor: '#E5E7E9',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 15,
          borderRadius: 2
        }} />
        <Text style={{ fontSize: 14, color: '#585959', fontWeight: '600', position: 'relative', bottom: -5 }}>{` ${dataX.title} ${Math.floor(dataX.valueInPercentage)}% ` }</Text>
        </View>
  );
  return (
        <View style={{ maxHeight: height * 0.3, width, justifyContent: 'space-evenly', paddingBottom: 15 }}> 
            { data.map(item => <RenderItemCard dataX={item} />)}
        </View>
  );
};

class RenderPollPage extends Component {
    static navigatorStyle = {
      navBarBackgroundColor: defaultGreen,
      statusBarTextColorScheme: 'light',
      navBarNoBorder: true,
      tabBarHidden: true,
    }
  
    constructor(props) {
      super(props);
      const { navigator } = this.props;
      navigator.setDrawerEnabled({ side: 'left', enabled: false });
      navigator.setButtons({
        leftButtons: [
          {
            id: 'Back.button',
            component: 'Back.Button',
            passProps: {
              navigator
            }
          }
        ]
      });
      this.state = {
        wantsToSeeResult: false,
        responses: {},
        reasons: this.generateReasons(),
      };
      // check if the user has participated in the poll before;
      if(this.props.data.length && this.props.data[0].responses.map(item => item.user.id).includes(this.props.user.id)) return this.generateResults(this.props.data[0].options)();
    }

    handleSubmit = () => {
      const { data, navigator, dispatch } =this.props;
      const keys = Object.keys(this.state.responses);
      const status = Object.keys(data[0].questions).reduce((a, b) => {
        if (keys.includes(`${b}`)) {
          a = true;
        } else {
          a = false;
        }
        return a;
      }, false);
      if (!status) return dispatchNotification(this.props.navigator)('Please complete the survey before submitting');
      const { responses, reasons } = this.state;
     
      const responsesX = Object.keys(responses).map((key) => {
        const ref = {};
        ref[`${key}`] = responses[`${key}`];
        return ref;
      }); 
      const dataX = { id: this.props.data[0]._id, responses: responsesX, reasons };
      dispatch(VoteResponse(navigator, (results) => {
        this.generateResults(results.options)(options => this.setState({ heatMap: options, wantsToSeeResult: true }));
      })(dataX));
        
    }

    generateResults = optionsX => (callback) => {
      const options = { ...optionsX };
      const transformOptions = (obj) => {
        // total number of responses for the question
        const total = Object.values(obj).reduce((a, b) => a + b);
        return Object.keys(obj).map((key) => {
          const standardWidth = width * 0.8;
          const value = parseInt(obj[`${key}`]) / total;
          const trueWidth = standardWidth * value;
          return {
            title: key,
            width: trueWidth,
            valueInPercentage: value * 100
          };
        });
      };
      Object.keys(options).forEach((key) => {
        options[`${key}`] = transformOptions(options[`${key}`]);
      });
      if(callback) return callback(options);
      this.state.wantsToSeeResult = true;
      this.state.heatMap = options;
    }

    generateReasons = () => Object.keys(this.props.data[0].questions).map((key) => {
      const ref = {};
      ref[`${key}`] = '';
      return ref;
    })

    pushUpValue = index => value => this.state.responses[`${index}`] = value;
    
      render = () => (
        <View style={{ flex: 1}}> 
            { this.props.data && 
                <RenderPollForm 
                data={this.props.data[0]} 
                pushUpValue={this.pushUpValue} 
                handleSubmit={this.handleSubmit} 
                wantsToSeeResult={this.state.wantsToSeeResult} 
                heatMap={this.state.heatMap} 
                />
                }
                { !this.props.data && null }
        </View>
      )
}

const mapStateToProps = state => ({
  user: state.users.current
})

export default connect(mapStateToProps)(RenderPollPage);