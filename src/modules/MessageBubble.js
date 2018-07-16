<Button 
            onPress={() => {
              onSend({ text: text.trim() }, true);
            }}
            style={{backgroundColor: '#82BE30', borderRadius: 0, height: '100%', width: 50}}>
            <Icon name="ios-send" style={{color: '#fff', alignSelf: 'center'}}/>
          </Button>