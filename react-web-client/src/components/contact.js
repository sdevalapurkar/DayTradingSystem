import React, { Component } from 'react';
import '../App.css';
import { Layout, Content } from 'react-mdl';
import lee from '../lee.jpeg';
import graeme from '../graeme.png';
import shreyas from '../shreyas.png';
import caity from '../caity.png';

class TeamMembers extends Component {
  render() {
    return (
      <div className="demo-big-content">
        <Layout>
          <Content>
            <div className="page-content" />
            <div className="team-div">
                <img
                    src={lee}
                    className="lee-zeitz"
                ></img>
                <img
                    src={graeme}
                    className="graeme-bates"
                ></img>
                <img
                    src={shreyas}
                    className="shreyas"
                ></img>
                <img
                    src={caity}
                    className="shreyas"
                ></img>
            </div>
            <div>
                <strong className="lee-name">Lee Zeitz</strong>
                <strong className="graeme-name">Graeme Bates</strong>
                <strong className="shreyas-name">Shreyas Devalapurkar</strong>
                <strong className="caity-name">Caity Gossland</strong>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default TeamMembers;
